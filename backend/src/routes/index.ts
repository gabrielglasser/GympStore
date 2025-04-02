import { Router } from "express";
import productRoutes from "./productRoute";

const router = Router();

router.use("/products", productRoutes);

export default router;