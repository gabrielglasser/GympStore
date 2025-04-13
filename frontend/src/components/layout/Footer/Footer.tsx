import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Sobre */}
          <div className={styles.column}>
            <h3>Sobre a GymPower</h3>
            <p>
              Sua loja especializada em suplementos esportivos de alta qualidade. 
              Compromisso com sua saúde e resultados.
            </p>
            <div className={styles.social}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className={styles.column}>
            <h3>Links Rápidos</h3>
            <ul>
              <li><Link to="/produtos">Produtos</Link></li>
              <li><Link to="/categorias">Categorias</Link></li>
              <li><Link to="/sobre">Sobre Nós</Link></li>
              <li><Link to="/politica-privacidade">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className={styles.column}>
            <h3>Contato</h3>
            <div className={styles.contactInfo}>
              <p>
                <Phone size={16} />
                <span>(11) 99999-9999</span>
              </p>
              <p>
                <Mail size={16} />
                <span>contato@gympower.com</span>
              </p>
              <p>
                <MapPin size={16} />
                <span>São Paulo, SP</span>
              </p>
            </div>
          </div>

          {/* Desenvolvedor */}
          <div className={styles.column}>
            <h3>Desenvolvedor</h3>
            <p>
              Desenvolvido por Gabriel dos Santos Glasser Rodrigues
            </p>
            <p className={styles.developerInfo}>
              Gostou do site? Quer um projeto personalizado? Entre em contato:
            </p>
            <div className={styles.developerContact}>
              <a href="mailto:gbsantos.dev@gmail.com" className={styles.emailLink}>
                <Mail size={16} />
                <span>gbsantos.dev@gmail.com</span>
              </a>
              <div className={styles.developerSocial}>
                <a href="https://github.com/gabrielglasser" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com/in/gabriel-s-glasser-rodrigues" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {currentYear} GymPower. Desenvolvido por Gabriel dos Santos Glasser Rodrigues. 
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};