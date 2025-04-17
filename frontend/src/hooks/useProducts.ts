import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Erro ao carregar produtos');
        toast.error('Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, isLoading, error };
};