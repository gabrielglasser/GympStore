import { Router } from "express";
import CartController from "../controllers/cartControllet";
import validate from "../middleware/validationMiddleware";
// import authMiddleware from "../middleware/authMiddleware";
import { addToCartSchema, updateCartItemSchema } from "../validations/cartValidation";

const router = Router();

// Todas as rotas requerem autenticação
// router.use(authMiddleware);

router.get("/", CartController.getCart);
router.post("/", validate(addToCartSchema), CartController.addToCart);
router.put("/:itemId", validate(updateCartItemSchema), CartController.updateCartItem);
router.delete("/:itemId", CartController.removeFromCart);
router.delete("/", CartController.clearCart);

export default router;