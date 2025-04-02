import { Router } from "express";
import ProductController from "../controllers/productController";
import validate from "../middleware/validationMiddleware";
// import authMiddleware from "../middleware/authMiddleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/productValidation";

const router = Router();

// Rotas públicas
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.get("/category/:categoryId", ProductController.getProductsByCategory);

// Rotas protegidas (requerem autenticação)
router.post(
  "/",
  // authMiddleware,
  validate(createProductSchema),
  ProductController.createProduct
);

router.put(
  "/:id",
  // authMiddleware,
  validate(updateProductSchema),
  ProductController.updateProduct
);

router.delete("/:id", /*authMiddleware*/ ProductController.deleteProduct);

export default router;