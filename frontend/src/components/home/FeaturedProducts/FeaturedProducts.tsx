import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './FeaturedProducts.module.scss';
import { Product } from '../../../types';
import { productService } from '../../../services/productService';
import { useCart } from '../../../contexts/CartContext';
import toast from 'react-hot-toast';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getFeatured();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product);
      toast.success('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Carregando produtos...
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Produtos em Destaque</h2>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className={styles.image} 
            />
            <div className={styles.content}>
              <div className={styles.category}>{product.category.name}</div>
              <h3 className={styles.title}>{product.name}</h3>
              <div className={styles.price}>
                R$ {product.price.toFixed(2)}
              </div>
              <Button 
                className={styles.addToCart}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Adicionar ao carrinho' : 'Produto indisponível'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};