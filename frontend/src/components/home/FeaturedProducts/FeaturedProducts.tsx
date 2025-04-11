import React from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './FeaturedProducts.module.scss';

const featuredProducts = [
  {
    id: 1,
    title: 'Whey Protein Isolado',
    category: 'Proteínas',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'BCAA 2:1:1',
    category: 'Aminoácidos',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    title: 'Creatina Monohidratada',
    category: 'Performance',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    title: 'Pré-Treino Ultimate',
    category: 'Pré-Treino',
    price: 99.90,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export const FeaturedProducts: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Produtos em Destaque</h2>
      </div>
      <div className={styles.grid}>
        {featuredProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <img src={product.image} alt={product.title} className={styles.image} />
            <div className={styles.content}>
              <div className={styles.category}>{product.category}</div>
              <h3 className={styles.title}>{product.title}</h3>
              <div className={styles.price}>
                R$ {product.price.toFixed(2)}
              </div>
              <Button className={styles.addToCart}>
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};