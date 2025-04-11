import React from 'react';
import { Hero } from '../../components/home/Hero/Hero';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <main className="container mx-auto px-4">
        <FeaturedProducts />
      </main>
    </div>
  );
};

export default Home;