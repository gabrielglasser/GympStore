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
      console.log('Iniciando download da imagem externa:', imageUrl);
      
      const response = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000 
      });
      
      console.log('Imagem baixada com sucesso, convertendo para base64');
      const buffer = Buffer.from(response.data, 'binary');
      const base64Image = buffer.toString('base64');
      const dataURI = `data:${response.headers['content-type']};base64,${base64Image}`;
      
      console.log('Iniciando upload para Cloudinary');
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'gymp',
          resource_type: 'auto'
        }, (error, result) => {
          if (error) {
            console.error('Erro no upload Cloudinary:', error);
            reject(error);
            return;
          }
          resolve(result);
        });
      });

      console.log('Upload concluído com sucesso:', result.secure_url);
      return result.secure_url;
      
    } catch (error) {
      console.error('Erro detalhado no processamento da imagem:', {
        error,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new ApiError(500, 'Erro ao processar imagem do produto');
    }
  }

  async createProduct(input: CreateProductInput): Promise<ProductWithCategory> {
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Categoria não encontrada");
    }


    let processedImage = input.image;
    if (processedImage && processedImage.startsWith('http')) {
      try {
        const result = await cloudinary.uploader.upload(processedImage, {
          folder: 'gymp',
          resource_type: 'auto'
        });
        processedImage = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Erro ao fazer upload da imagem");
      }
    }

    return await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock,
        categoryId: input.categoryId,
        brand: input.brand,
        weight: input.weight,
        image: processedImage, 
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