import api from './api';
import { PaymentMethod, PaymentDetails } from '../types';

interface CreateOrderPayload {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  payment: {
    method: PaymentMethod;
    installments?: number;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  payment?: {
    method: PaymentMethod;
    status: string;
    details: unknown;
  };
}

export const orderService = {
  createOrder: async (data: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  getPaymentDetails: async (total: number): Promise<PaymentDetails> => {
    const response = await api.get<PaymentDetails>('/payment/details', {
      params: { total }
    });
    return response.data;
  }
};