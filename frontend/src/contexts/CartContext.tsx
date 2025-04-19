/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CartContextData {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  total: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const cart = await cartService.getCart();
      setItems(cart.items);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para adicionar produtos ao carrinho');
      return;
    }

    try {
      setLoading(true);
      const cart = await cartService.addToCart(product.id, quantity);
      setItems(cart.items);
      toast.success('Produto adicionado ao carrinho!');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      const message = error.response?.data?.message || 'Erro ao adicionar ao carrinho';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity === 0) {
      await removeFromCart(itemId);
      return;
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
  }, []);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      const cart = await cartService.removeFromCart(itemId);
      setItems(cart.items);

    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast.error('Erro ao remover produto do carrinho');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setItems([]);
      // Removida notificação de sucesso que estava duplicada
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast.error('Erro ao limpar carrinho');
    } finally {
      setLoading(false);
    }
  }, []);

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};