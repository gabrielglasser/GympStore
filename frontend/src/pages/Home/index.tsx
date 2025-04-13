import React from 'react';
import { Hero } from '../../components/home/Hero/Hero';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { HealthTips } from '../../components/home/HealthTips/HealthTips';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <main className={styles.main}>
        <FeaturedProducts />
        <HealthTips />
      </main>
    </div>
  );
};

export default Home;