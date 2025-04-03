"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
// import authMiddleware from "../middleware/authMiddleware";
const categoryValidation_1 = require("../validations/categoryValidation");
const router = (0, express_1.Router)();
// Rotas públicas
router.get("/", categoryController_1.default.getCategories);
router.get("/:id", categoryController_1.default.getCategoryById);
// Rotas protegidas (requerem autenticação)
router.post("/", 
//   authMiddleware,
(0, validationMiddleware_1.default)(categoryValidation_1.createCategorySchema), categoryController_1.default.createCategory);
router.put("/:id", 
//   authMiddleware,
(0, validationMiddleware_1.default)(categoryValidation_1.updateCategorySchema), categoryController_1.default.updateCategory);
router.delete("/:id", categoryController_1.default.deleteCategory);
exports.default = router;
