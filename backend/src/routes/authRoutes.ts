import { Router } from "express";
import AuthController from "../controllers/authController";
import validate from "../middleware/validationMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import { loginSchema } from "../validations/authValidation";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", authMiddleware, AuthController.getCurrentUser);

export default router;