import { Router } from "express";
import productRoutes from "./productRoute";
import categoryRoutes from "./categoryRoute";

const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;