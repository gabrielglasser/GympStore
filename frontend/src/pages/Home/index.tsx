import React from 'react';
import { Hero } from '../../components/home/Hero/Hero';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { HealthTips } from '../../components/home/HealthTips/HealthTips';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-12">
        <FeaturedProducts />
        <HealthTips />
      </main>
    </div>
  );
};

export default Home;