import { Router } from "express";
import productRoutes from "./productRoute";
import categoryRoutes from "./categoryRoute";
import cartRoutes from "./cartRoute";

const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);

export default router;