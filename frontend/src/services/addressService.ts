/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { Address } from '../types';
import { authService } from './authService';

export const addressService = {
  getDefaultAddress: async (): Promise<Address | null> => {
    try {
      const token = authService.getToken();
      const response = await api.get<{ data: Address }>('/addresses/default', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data; 
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  },

  saveAddress: async (address: Address): Promise<Address> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Token não fornecido');
      }
      const response = await api.post<{ data: Address }>('/addresses', address, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      throw error;
    }
  },

  updateAddress: async (address: Address): Promise<Address> => {
    const response = await api.put<{ data: Address }>(`/addresses/${address.id}`, address);
    return response.data.data;
  },

  getAllAddresses: async (): Promise<Address[]> => {
    const response = await api.get<{ data: Address[] }>('/addresses');
    return response.data.data;
  }
};