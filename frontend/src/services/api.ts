import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.signOut();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;