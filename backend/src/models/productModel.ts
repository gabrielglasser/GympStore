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
  categoryId: string;
  brand: string;
  weight: number;
  image: string;
  flavor?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}