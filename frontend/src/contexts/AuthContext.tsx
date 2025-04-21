/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>; 
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      // Tenta buscar dados do usuário para validar o token
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      // Se houver erro (token inválido/expirado), fazer logout
      authService.signOut();
      setUser(null);
      if (location.pathname !== '/auth') {
        navigate('/auth', { state: { from: location }, replace: true });
      }
    }
  }, [navigate, location]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.signIn(email, password);
      if (response) {
        setUser(response.user);
      }
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      throw error;
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authService.signUp(name, email, password);
      if (response?.user) {
        setUser(response.user);
      }
      toast.success('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar cadastro');
      throw error;
    }
  }, [navigate]);

  const signOut = useCallback(() => {
    authService.signOut();
    setUser(null);
    navigate('/auth');
  }, [navigate]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn,
        signUp, 
        signOut,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};