'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    setError('');
    try {
      await login(data);
    } catch (err: any) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-10 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-900/20 rounded-full blur-3xl group-hover:bg-purple-900/30 transition-all duration-700"></div>

        <div className="relative z-10 text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter italic">
            EVENT<span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,1)]">HUB</span>
          </h1>
          <p className="text-neutral-400 font-medium tracking-wide border-t border-purple-500/30 pt-3 inline-block">ACCESO EXCLUSIVO</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-r-lg mb-8 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">Email corporativo</label>
            <input
              {...register('email', { required: 'El email es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })}
              type="email"
              className={`w-full bg-[#080808] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-zinc-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm [selection:background-color:rgba(168,85,247,0.4)]`}
              placeholder="agente@eventhub.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input
              {...register('password', { required: 'La contraseña es obligatoria' })}
              type="password"
              className={`w-full bg-[#080808] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-zinc-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm [selection:background-color:rgba(168,85,247,0.4)]`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.password.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 text-white font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] uppercase tracking-tighter text-lg"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar ahora'}
          </button>
        </form>

        <div className="relative z-10 mt-10 text-center">
          <p className="text-sm text-neutral-500 font-medium">
            ¿Aún no eres miembro?{' '}
            <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-bold underline underline-offset-8 decoration-purple-500/50 hover:decoration-purple-500 transition-all">
              Únete a la élite
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
