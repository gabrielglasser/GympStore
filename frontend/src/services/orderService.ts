import api from './api';
import { authService } from './authService';
import { PaymentMethod, PaymentDetails, Order, PaymentData } from '../types';

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

interface OrderResponse {
  data: Order;
}

interface PaymentDetailsResponse {
  data: PaymentDetails;
}

export const orderService = {
  createOrder: async (data: CreateOrderPayload): Promise<Order> => {
    const token = authService.getToken();
    const response = await api.post<OrderResponse>('/orders', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  getPaymentDetails: async (total: number): Promise<PaymentDetails> => {
    const token = authService.getToken();
    const response = await api.get<PaymentDetailsResponse>('/payment/details', {
      params: { total },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  }
};