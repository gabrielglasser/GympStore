/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = authService.getUser();
    const token = authService.getToken();
    return token && storedUser ? storedUser : null;
  });

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