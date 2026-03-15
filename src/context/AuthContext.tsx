'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister } from '@/api/api.client';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing saved user:', e);
          setUser({ token: savedToken });
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await apiLogin(credentials);
      const authToken = data.access_token || data.token;
      
      // Normalizar el objeto de usuario: buscar el ID en cualquier lugar
      const rawUser = data.user || data;
      const userData = {
        id: rawUser.id || rawUser._id || rawUser.userId || rawUser.sub || data.userId || data.id,
        email: rawUser.email || data.email || credentials.email,
        name: rawUser.name || data.name || 'Usuario'
      };
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      
      router.push('/');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const data = await apiRegister(userData);
      // Opcional: Loguear automáticamente si el backend devuelve un token tras registro
      if (data.token || data.access_token) {
        const authToken = data.access_token || data.token;
        const newUser = data.user || {
          ...userData,
          id: data.id || data._id || data.userId || data.sub
        };
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(authToken);
        setUser(newUser);
        router.push('/');
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
