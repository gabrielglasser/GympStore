import { Product, Prisma } from "@prisma/client";

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: true;
  };
}>;

export interface CreateCategoryInput {
  name: string;
  slug: string;
  image: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}