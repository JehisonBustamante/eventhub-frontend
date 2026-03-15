import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Event Services
export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await apiClient.post('/events', eventData);
  return response.data;
};

export default apiClient;
