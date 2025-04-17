import React from 'react';
import { Button } from '../../ui/Button/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[600px] bg-black/70 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-blend-overlay flex items-center justify-center text-center text-white mb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight uppercase">
          Potencialize seus resultados
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 font-medium px-4 max-w-3xl mx-auto">
          Os melhores suplementos para seu objetivo com as melhores condições do mercado.
        </p>
        <Button className="px-8 py-4 text-lg font-bold tracking-wide bg-primary hover:bg-primary-dark transform hover:-translate-y-0.5 transition-all duration-200">
          Comprar agora
        </Button>
      </div>
    </section>
  );
};