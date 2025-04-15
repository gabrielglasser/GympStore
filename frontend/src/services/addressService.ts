import  api  from './api';
import { Address } from '../types';

export const addressService = {
  getDefaultAddress: async (): Promise<Address | null> => {
    try {
      const response = await api.get<Address>('/addresses/default');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  },

  saveAddress: async (address: Address): Promise<Address> => {
    const response = await api.post<Address>('/addresses', address);
    return response.data;
  }
};