import { Router } from "express";
import CategoryController from "../controllers/categoryController";
import validate from "../middleware/validationMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categoryValidation";

const router = Router();

// Rotas públicas
router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategoryById);

// Rotas protegidas (requerem autenticação)
router.post(
  "/",
  authMiddleware,
  validate(createCategorySchema),
  CategoryController.createCategory
);

router.put(
  "/:id",
  authMiddleware,
  validate(updateCategorySchema),
  CategoryController.updateCategory
);

router.delete("/:id",  CategoryController.deleteCategory);

export default router;