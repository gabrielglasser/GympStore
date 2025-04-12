import api from './api';
import Cookies from 'js-cookie';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const TOKEN_KEY = '@GympStore:token';
const USER_KEY = '@GympStore:user';

export const authService = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    
    if (response.data.token) {
      Cookies.set(TOKEN_KEY, response.data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users', data);
    
    if (response.data.token) {
      Cookies.set(TOKEN_KEY, response.data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response.data;
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