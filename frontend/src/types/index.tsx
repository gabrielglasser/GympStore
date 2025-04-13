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
  quantity: number;
  product: {
    [x: string]: number;
    id: string;
    name: string;
    price: number;
    images: string[];
    flavor: string | null;
    stock: number;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

