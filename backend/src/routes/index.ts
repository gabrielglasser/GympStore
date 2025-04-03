import { Router } from "express";
import productRoutes from "./productRoute";
import categoryRoutes from "./categoryRoute";
import cartRoutes from "./cartRoute";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoute";

const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;