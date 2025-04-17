import api from './api';
import { Category } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Category | null> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return null;
    }
  }
};