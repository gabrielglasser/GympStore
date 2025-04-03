"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
// import adminMiddleware from "../middleware/authMiddleware";
const userValidation_1 = require("../validations/userValidation");
const router = (0, express_1.Router)();
// Rotas públicas
router.post("/", (0, validationMiddleware_1.default)(userValidation_1.createUserSchema), userController_1.default.createUser);
// Rotas protegidas (requerem autenticação)
router.use(authMiddleware_1.default);
router.get("/", /*adminMiddleware*/ userController_1.default.getUsers);
router.get("/:id", userController_1.default.getUserById);
router.put("/:id", (0, validationMiddleware_1.default)(userValidation_1.updateUserSchema), userController_1.default.updateUser);
router.delete("/:id", userController_1.default.deleteUser);
// Sub-rotas para endereços
const addressRoutes_1 = __importDefault(require("./addressRoutes"));
router.use("/:userId/addresses", addressRoutes_1.default);
exports.default = router;
