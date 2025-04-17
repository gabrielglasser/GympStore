import { useState, useEffect } from 'react';
import { Category } from '../types';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        toast.error('Erro ao carregar categorias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};