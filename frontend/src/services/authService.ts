/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const TOKEN_KEY = '@GympStore:token';
const USER_KEY = '@GympStore:user';

export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.data.token) {
        const { token, user } = response.data.data;
        
        // Salvando o token
        Cookies.set(TOKEN_KEY, token, {
          expires: 7,
          secure: false, 
          sameSite: 'lax'
        });
        
        // Salvando usuário
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        toast.success('Login realizado com sucesso!');
        return { token, user };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/users', { name, email, password });
      
      if (response.data.data.token) {
        const { token, user } = response.data.data;
        
        Cookies.set(TOKEN_KEY, token, {
          expires: 7,
          secure: false,
          sameSite: 'lax'
        });
        
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        toast.success('Cadastro realizado com sucesso!');
        return { token, user };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer cadastro';
      toast.error(message);
      throw error;
    }
  },

  signOut: () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_KEY);
  }
};