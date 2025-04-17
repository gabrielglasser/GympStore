import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import { ProductWithCategory, CreateProductInput, UpdateProductInput } from "../models/productModel";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

  private async uploadExternalImageToCloudinary(imageUrl: string): Promise<string> {
    try {
      // Baixa a imagem
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      
      // Salva temporariamente
      const tempPath = path.join('tmp', `temp-${Date.now()}.jpg`);
      fs.writeFileSync(tempPath, buffer);

      // Upload para o Cloudinary usando a API v2
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'gymp',
        resource_type: 'auto'
      });
      
      // Remove arquivo temporário
      fs.unlinkSync(tempPath);
      
      return result.secure_url;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new ApiError(500, 'Erro ao processar imagem');
    }
  }

  async createProduct(input: CreateProductInput): Promise<ProductWithCategory> {
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    // Processa as imagens
    const processedImages = await Promise.all(
      input.images.map(async (image: string) => {
        if (image.startsWith('http')) {
          return await this.uploadExternalImageToCloudinary(image);
        }
        return image;
      })
    );

    return await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock,
        categoryId: input.categoryId,
        brand: input.brand,
        weight: input.weight,
        images: processedImages,
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
    if (!categoryId) {
      throw new ApiError(400, "ID da categoria é obrigatório");
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }

    return await prisma.product.findMany({
      where: {
        categoryId: categoryId
      },
      include: {
        category: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}

export default new ProductService();