import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import styles from './Categories.module.scss';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: Product[];
}

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader className={styles.spinner} />
        <span>Carregando categorias...</span>
      </div>
    );
  }

  return (
    <div className={styles.categories}>
      <div className="container mx-auto">
        <div className={styles.header}>
          <h1>Categorias</h1>
          <p>Explore nossa seleção completa de suplementos organizados por categoria</p>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              onClick={() => navigate(`/produtos?categoria=${category.slug}`)}
            >
              <img 
                src={`${category.image}?auto=format&fit=crop&w=800&q=80`}
                alt={category.name} 
              />
              <div className={styles.overlay}>
                <h3>{category.name}</h3>
                <span className={styles.productCount}>
                  {category.products.length} produtos
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;