import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-xl">GymPower</span>
          </Link>

          {/* Menu Button (Mobile) */}
          <button 
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/produtos" className="text-gray-600 hover:text-primary transition-colors">
              Produtos
            </Link>
            <Link to="/categorias" className="text-gray-600 hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link to="/sobre" className="text-gray-600 hover:text-primary transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="outline" className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Carrinho</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Entrar</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/produtos"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/categorias"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Categorias
            </Link>
            <Link
              to="/sobre"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
          </div>
          <div className="px-2 pt-4 pb-3 border-t border-gray-200">
            <Link
              to="/cart"
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Carrinho</span>
              {cartItemsCount > 0 && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-gray-700">{user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};