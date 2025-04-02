import { Category, Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
    reviews: true;
  };
}>;

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  brand: string;
  weight: number;
  flavor?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}