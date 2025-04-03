"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartControllet_1 = __importDefault(require("../controllers/cartControllet"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
// import authMiddleware from "../middleware/authMiddleware";
const cartValidation_1 = require("../validations/cartValidation");
const router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
// router.use(authMiddleware);
router.get("/", cartControllet_1.default.getCart);
router.post("/", (0, validationMiddleware_1.default)(cartValidation_1.addToCartSchema), cartControllet_1.default.addToCart);
router.put("/:itemId", (0, validationMiddleware_1.default)(cartValidation_1.updateCartItemSchema), cartControllet_1.default.updateCartItem);
router.delete("/:itemId", cartControllet_1.default.removeFromCart);
router.delete("/", cartControllet_1.default.clearCart);
exports.default = router;
