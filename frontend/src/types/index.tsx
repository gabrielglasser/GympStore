export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: string;
  weight: number;
  flavor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: Product[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    flavor?: string;
  };
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id?: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';

export interface PaymentData {
  method: PaymentMethod;
  installments?: number;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentDetails {
  CREDIT_CARD: {
    maxInstallments: number;
    minInstallmentValue: number;
  };
  DEBIT_CARD: {
    banks: string[];
  };
  PIX: {
    qrCodeUrl?: string;
    expiresIn: number;
  };
  BOLETO: {
    barCode?: string;
    expiresIn: number;
  };
}

