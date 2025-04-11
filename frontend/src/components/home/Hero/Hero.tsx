import React from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './Hero.module.scss';

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Potencialize seus resultados</h1>
        <p>Os melhores suplementos para seu objetivo com as melhores condições do mercado.</p>
        <Button className={styles.cta}>
          Comprar agora
        </Button>
      </div>
    </section>
  );
};