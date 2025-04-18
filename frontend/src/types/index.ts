export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  weight: number;
  image: string;  
  flavor?: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';

export interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  installments?: number;
}

export interface PaymentDetails {
  CREDIT_CARD?: {
    installments: Array<{
      quantity: number;
      value: number;
    }>;
  };
  DEBIT_CARD?: {
    maxValue: number;
  };
  PIX?: {
    qrCodeUrl: string;
    expiresIn: number;
  };
  BOLETO?: {
    barCode: string;
    expiresIn: number;
  };
}
export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface Address {
  id?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}
