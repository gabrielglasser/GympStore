import { Router } from "express";
import UserController from "../controllers/userController";
import validate from "../middleware/validationMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/authMiddleware";
import {
  createUserSchema,
  updateUserSchema
} from "../validations/userValidation";

const router = Router();

// Rotas públicas
router.post("/", validate(createUserSchema), UserController.createUser);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

router.get("/", adminMiddleware, UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", validate(updateUserSchema), UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// Sub-rotas para endereços
import addressRoutes from "./addressRoutes";
router.use("/:userId/addresses", addressRoutes);

export default router;