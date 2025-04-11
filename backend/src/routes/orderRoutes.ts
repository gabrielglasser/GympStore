import { Router } from "express";
import OrderController from "../controllers/orderController";
import validate from "../middleware/validationMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import { createOrderSchema, updateOrderSchema } from "../validations/oderValidation";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.post("/", authMiddleware, validate(createOrderSchema), OrderController.createOrder);
router.get("/", authMiddleware, OrderController.getUserOrders);
router.get("/:id", authMiddleware, OrderController.getOrder);

// Apenas admin pode atualizar pedidos
router.patch("/:id", authMiddleware, validate(updateOrderSchema), OrderController.updateOrder);

export default router;