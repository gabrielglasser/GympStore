import { Router } from "express";
import productRoutes from "./productRoute";
import categoryRoutes from "./categoryRoute";
import cartRoutes from "./cartRoute";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoute";
import orderRoutes from "./orderRoutes";
import addressRoutes from "./addressRoutes";
import paymentRoutes from "./paymentRoutes";


const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users/:userId/addresses", addressRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/addresses", addressRoutes);

export default router;