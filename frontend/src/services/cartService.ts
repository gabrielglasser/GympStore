import api from './api';
import { Cart } from '../types';

interface CartResponse {
  data: Cart;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<CartResponse>('/cart');
    return response.data.data;
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.post<CartResponse>('/cart', {
      productId,
      quantity
    });
    return response.data.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.put<CartResponse>(`/cart/${itemId}`, {
      quantity
    });
    return response.data.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<CartResponse>(`/cart/${itemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<CartResponse>('/cart');
    return response.data.data;
  }
};