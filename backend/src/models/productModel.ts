import { Category, Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
    reviews: true;
  };
}>;

export interface CreateProductInput {
  images: any;
  weight: any;
  brand: any;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  flavor?: string | null;
  imageUrl: string; 
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}