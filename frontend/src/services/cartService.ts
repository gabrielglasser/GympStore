import api from './api';
import { Cart } from '../types';
import { authService } from './authService';

interface CartResponse {
  data: Cart;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const token = authService.getToken();
    const response = await api.get<CartResponse>('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const token = authService.getToken();
    const response = await api.post<CartResponse>('/cart', {
      productId,
      quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const token = authService.getToken();
    const response = await api.put<CartResponse>(`/cart/${itemId}`, {
      quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const token = authService.getToken();
    const response = await api.delete<CartResponse>(`/cart/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const token = authService.getToken();
    const response = await api.delete<CartResponse>('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  }
};