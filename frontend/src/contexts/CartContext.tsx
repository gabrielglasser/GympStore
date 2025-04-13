/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CartContextData {
  items: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      setItems(cart.items);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para adicionar produtos ao carrinho');
      return;
    }

    try {
      setLoading(true);
      const cart = await cartService.addToCart(productId, quantity);
      setItems(cart.items);
      toast.success('Produto adicionado ao carrinho');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      const message = error.response?.data?.message || 'Erro ao adicionar ao carrinho';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity === 0) {
      return removeFromCart(itemId);
    }

    try {
      setLoading(true);
      const cart = await cartService.updateCartItem(itemId, quantity);
      setItems(cart.items);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast.error('Erro ao atualizar quantidade');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      const cart = await cartService.removeFromCart(itemId);
      setItems(cart.items);
      toast.success('Produto removido do carrinho');
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast.error('Erro ao remover produto do carrinho');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setItems([]);
      toast.success('Carrinho limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast.error('Erro ao limpar carrinho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        loading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};