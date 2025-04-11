import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShoppingCart, User } from 'lucide-react';
import styles from './Header.module.scss';
import { Button } from '../../ui/Button/Button';

export const Header: React.FC = () => {
  const cartItemsCount = 0; // This will be managed by cart context later

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Dumbbell size={24} />
          <span>GymPower</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/produtos" className={styles.link}>
            Produtos
          </Link>
          <Link to="/categorias" className={styles.link}>
            Categorias
          </Link>
          <Link to="/sobre" className={styles.link}>
            Sobre
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartButton}>
            <Button variant="outline">
              <ShoppingCart size={20} />
              Carrinho
              {cartItemsCount > 0 && (
                <span className={styles.cartCount}>{cartItemsCount}</span>
              )}
            </Button>
          </Link>
          <Link to="/login">
            <Button>
              <User size={20} />
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};