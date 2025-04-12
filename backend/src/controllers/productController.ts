import { Request, Response, NextFunction } from "express";
import ProductService from "../service/productService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateProductInput, UpdateProductInput } from "../models/productModel";

class ProductController {
  async getProducts(req: Request, res: Response) {
    const products = await ProductService.getAllProducts();
    ApiResponse.success(res, products);
  }

  async getProductById(req: Request, res: Response) {
    const product = await ProductService.getProductById(req.params.id);
    ApiResponse.success(res, product);
  }

  async createProduct(req: Request, res: Response) {
    const product = await ProductService.createProduct(req.body);
    ApiResponse.created(res, product);
  }

  async updateProduct(req: Request, res: Response) {
    const product = await ProductService.updateProduct({
      id: req.params.id,
      ...req.body,
    });
    ApiResponse.success(res, product);
  }

  async deleteProduct(req: Request, res: Response) {
    await ProductService.deleteProduct(req.params.id);
    ApiResponse.success(res, null, "Produto deletado com sucesso");
  }

  async getProductsByCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const products = await ProductService.getProductsByCategory(categoryId);
    ApiResponse.success(res, products);
  }
}

// Exportando instâncias com handlers assíncronos
export default {
  getProducts: asyncHandler(new ProductController().getProducts),
  getProductById: asyncHandler(new ProductController().getProductById),
  createProduct: asyncHandler(new ProductController().createProduct),
  updateProduct: asyncHandler(new ProductController().updateProduct),
  deleteProduct: asyncHandler(new ProductController().deleteProduct),
  getProductsByCategory: asyncHandler(new ProductController().getProductsByCategory),
};