"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
// import authMiddleware from "../middleware/authMiddleware";
const productValidation_1 = require("../validations/productValidation");
const router = (0, express_1.Router)();
// Rotas públicas
router.get("/", productController_1.default.getProducts);
router.get("/:id", productController_1.default.getProductById);
router.get("/category/:categoryId", productController_1.default.getProductsByCategory);
// Rotas protegidas (requerem autenticação)
router.post("/", 
// authMiddleware,
(0, validationMiddleware_1.default)(productValidation_1.createProductSchema), productController_1.default.createProduct);
router.put("/:id", 
// authMiddleware,
(0, validationMiddleware_1.default)(productValidation_1.updateProductSchema), productController_1.default.updateProduct);
router.delete("/:id", /*authMiddleware*/ productController_1.default.deleteProduct);
exports.default = router;
