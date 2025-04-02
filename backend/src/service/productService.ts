import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import { ProductWithCategory, CreateProductInput, UpdateProductInput } from "../models/productModel";

const prisma = new PrismaClient();

class ProductService {
  async getAllProducts(): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      include: {
        category: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getProductById(id: string): Promise<ProductWithCategory> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new ApiError(404, "Produto não encontrado");
    }

    return product;
  }

  async createProduct(input: CreateProductInput): Promise<ProductWithCategory> {
    // Verifica se a categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    return await prisma.product.create({
      data: {
        ...input,
        flavor: input.flavor || null,
      },
      include: {
        category: true,
        reviews: true,
      },
    });
  }

  async updateProduct(input: UpdateProductInput): Promise<ProductWithCategory> {
    const productExists = await prisma.product.findUnique({
      where: { id: input.id },
    });

    if (!productExists) {
      throw new ApiError(404, "Produto não encontrado");
    }

    return await prisma.product.update({
      where: { id: input.id },
      data: {
        ...input,
        flavor: input.flavor || null,
      },
      include: {
        category: true,
        reviews: true,
      },
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new ApiError(404, "Produto não encontrado");
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  async getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        reviews: true,
      },
    });
  }
}

export default new ProductService();