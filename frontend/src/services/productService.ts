import api from './api';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const productService = {
  getAll: async (search?: string): Promise<Product[]> => {
    try {
      const response = await api.get('/products', {
        params: { search }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar produtos');
      return [];
    }
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    if (!categoryId) return [];
    
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar produtos da categoria:', error);
      toast.error('Erro ao carregar produtos da categoria');
      return [];
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      // Usando a rota correta para produtos em destaque
      const response = await api.get('/products');
      return response.data.data.slice(0, 4); 
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      toast.error('Erro ao carregar produtos em destaque');
      return [];
    }
  }
};

export const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias');
      return [];
    }
  }
};