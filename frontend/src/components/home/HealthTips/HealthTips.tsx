import React from 'react';
import styles from './HealthTips.module.scss';

const tips = [
    {
      title: 'Hidratação é Essencial',
      description: 'Beber pelo menos 2 litros de água por dia ajuda no funcionamento do metabolismo e melhora a performance nos treinos.',
      image: 'https://images.unsplash.com/photo-1620726337086-caf521fe53db?q=80&w=1974auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Alimente-se Antes do Treino',
      description: 'Uma refeição leve e balanceada antes do treino melhora o desempenho e evita a perda de massa muscular.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Sono de Qualidade',
      description: 'Dormir bem é fundamental para a recuperação muscular e a saúde mental.',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Suplementos com Orientação',
      description: 'Suplementação deve ser feita com acompanhamento nutricional para atingir os melhores resultados.',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80'
    }
];
  

export const HealthTips: React.FC = () => {
  return (
    <section className={styles.tipsSection}>
      <h2 className={styles.title}>Dicas de Saúde & Nutrição</h2>
      <div className={styles.grid}>
        {tips.map((tip, index) => (
          <div key={index} className={styles.card}>
            <img src={tip.image} alt={tip.title} className={styles.image} />
            <div className={styles.content}>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
