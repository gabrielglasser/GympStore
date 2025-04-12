import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import styles from './Header.module.scss';
import { Button } from '../../ui/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useAuth();
  const { items } = useCart();
  const cartItemsCount = items.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Dumbbell size={24} />
          <span>GymPower</span>
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/produtos" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Produtos
          </Link>
          <Link to="/categorias" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Categorias
          </Link>
          <Link to="/sobre" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Sobre
          </Link>
        </nav>

        <div className={`${styles.actions} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/cart" className={styles.cartButton} onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline">
              <ShoppingCart size={20} />
              <span className={styles.buttonText}>Carrinho</span>
              {cartItemsCount > 0 && (
                <span className={styles.cartCount}>{cartItemsCount}</span>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>{user?.name}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={20} />
                <span className={styles.buttonText}>Sair</span>
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
              <Button>
                <User size={20} />
                <span className={styles.buttonText}>Entrar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};