/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { Address } from '../types';

export const addressService = {
  getDefaultAddress: async (): Promise<Address | null> => {
    try {
      const response = await api.get<{ data: Address }>('/addresses/default');
      return response.data.data; 
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  },

  saveAddress: async (address: Address): Promise<Address> => {
    try {
      const response = await api.post<{ data: Address }>('/addresses', address);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar endereço');
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