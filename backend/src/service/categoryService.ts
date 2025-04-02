import { PrismaClient } from "@prisma/client";
import { CreateCategoryInput, UpdateCategoryInput } from "../models/categoryModel";
import ApiError from "../utils/apiError";
import { CategoryWithProducts } from "../models/categoryModel";

const prisma = new PrismaClient();

class CategoryService {
  async getAllCategories(): Promise<CategoryWithProducts[]> {
    return await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategoryById(id: string): Promise<CategoryWithProducts> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    return category;
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryWithProducts> {
    // Verifica se o slug já existe
    const slugExists = await prisma.category.findUnique({
      where: { slug: input.slug },
    });

    if (slugExists) {
      throw new ApiError(400, "Slug já está em uso");
    }

    return await prisma.category.create({
      data: input,
      include: {
        products: true,
      },
    });
  }

  async updateCategory(input: UpdateCategoryInput): Promise<CategoryWithProducts> {
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.id },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    // Verifica se o novo slug já existe (se foi alterado)
    if (input.slug && input.slug !== categoryExists.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: input.slug },
      });

      if (slugExists) {
        throw new ApiError(400, "Slug já está em uso");
      }
    }

    return await prisma.category.update({
      where: { id: input.id },
      data: input,
      include: {
        products: true,
      },
    });
  }

  async deleteCategory(id: string): Promise<void> {
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    // Verifica se a categoria tem produtos associados
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new ApiError(400, "Não é possível deletar categoria com produtos associados");
    }

    await prisma.category.delete({
      where: { id },
    });
  }
}

export default new CategoryService();