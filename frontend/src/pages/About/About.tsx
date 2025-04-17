import React from 'react';
import { Users, ShoppingBag, Award, Star } from 'lucide-react';
import styles from './About.module.scss';

const About: React.FC = () => {
    const stats = [
        { icon: <Users size={32} />, value: '10k+', label: 'Clientes Satisfeitos' },
        { icon: <ShoppingBag size={32} />, value: '5k+', label: 'Produtos Vendidos' },
        { icon: <Award size={32} />, value: '15+', label: 'Anos de Experiência' },
        { icon: <Star size={32} />, value: '4.9', label: 'Avaliação Média' },
    ];

    const team = [
        {
            name: 'João Silva',
            role: 'CEO & Fundador',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Especialista em nutrição esportiva com mais de 15 anos de experiência.'
        },
        {
            name: 'Maria Santos',
            role: 'Nutricionista Chefe',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Pós-graduada em nutrição esportiva e especialista em suplementação.'
        },
        {
            name: 'Pedro Costa',
            role: 'Diretor de Produtos',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Responsável pela seleção e qualidade dos produtos.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossa História</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Conheça mais sobre a GymPower e nossa missão de ajudar você a alcançar seus objetivos
                    </p>
                </div>
                <div className={styles.about}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h1>Sobre a GympPower</h1>
                            <p>
                                Somos apaixonados por ajudar pessoas a alcançarem seus objetivos de saúde e fitness
                                através da nutrição adequada e suplementação de qualidade.
                            </p>
                        </div>

                        <div className={styles.content}>
                            <div className={styles.image}>
                                <img
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                                    alt="Nossa História"
                                />
                            </div>
                            <div className={styles.text}>
                                <h2>Nossa História</h2>
                                <p>
                                    Fundada em 2008, a GympPower nasceu da paixão por fitness e nutrição esportiva.
                                    Começamos como uma pequena loja local e hoje somos referência nacional em
                                    suplementação esportiva.
                                </p>
                                <p>
                                    Nossa missão é fornecer os melhores produtos do mercado, com preços justos e
                                    um atendimento excepcional. Trabalhamos apenas com marcas reconhecidas e
                                    produtos de qualidade comprovada.
                                </p>
                                <p>
                                    Contamos com uma equipe de especialistas em nutrição esportiva prontos para
                                    auxiliar você a escolher os melhores suplementos para seus objetivos.
                                </p>
                            </div>
                        </div>

                        <div className={styles.stats}>
                            {stats.map((stat, index) => (
                                <div key={index} className={styles.stat}>
                                    <div className={styles.icon}>{stat.icon}</div>
                                    <div className={styles.value}>{stat.value}</div>
                                    <div className={styles.label}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.team}>
                            <h2>Nossa Equipe</h2>
                            <div className={styles.members}>
                                {team.map((member, index) => (
                                    <div key={index} className={styles.member}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className={styles.memberImage}
                                        />
                                        <div className={styles.memberInfo}>
                                            <h3>{member.name}</h3>
                                            <div className={styles.role}>{member.role}</div>
                                            <p>{member.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.disclaimer}>
                        <p>*Todos os dados, nomes e imagens apresentados nesta página são fictícios e utilizados apenas para fins ilustrativos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;