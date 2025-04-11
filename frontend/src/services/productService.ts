import api from './api';
import { Product } from '../types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data.data;
  },
  
  getFeatured: async (): Promise<Product[]> => {
    const response = await api.get('/products');

    return response.data.data.slice(0, 4);
  }
};