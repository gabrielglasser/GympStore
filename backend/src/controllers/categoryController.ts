import { Request, Response } from "express";
import CategoryService from "../service/categoryService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateCategoryInput, UpdateCategoryInput } from "../models/categoryModel";

class CategoryController {
  async getCategories(req: Request, res: Response) {
    const categories = await CategoryService.getAllCategories();
    ApiResponse.success(res, categories);
  }

  async getCategoryById(req: Request, res: Response) {
    const category = await CategoryService.getCategoryById(req.params.id);
    ApiResponse.success(res, category);
  }

  async createCategory(req: Request, res: Response) {
    const category = await CategoryService.createCategory(req.body);
    ApiResponse.created(res, category);
  }

  async updateCategory(req: Request, res: Response) {
    const category = await CategoryService.updateCategory({
      id: req.params.id,
      ...req.body,
    });
    ApiResponse.success(res, category);
  }

  async deleteCategory(req: Request, res: Response) {
    await CategoryService.deleteCategory(req.params.id);
    ApiResponse.success(res, null, "Categoria deletada com sucesso");
  }
}

// Exportando instâncias com handlers assíncronos
export default {
  getCategories: asyncHandler(new CategoryController().getCategories),
  getCategoryById: asyncHandler(new CategoryController().getCategoryById),
  createCategory: asyncHandler(new CategoryController().createCategory),
  updateCategory: asyncHandler(new CategoryController().updateCategory),
  deleteCategory: asyncHandler(new CategoryController().deleteCategory),
};