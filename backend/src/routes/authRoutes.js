"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authValidation_1 = require("../validations/authValidation");
const router = (0, express_1.Router)();
router.post("/login", (0, validationMiddleware_1.default)(authValidation_1.loginSchema), authController_1.default.login);
router.get("/me", authMiddleware_1.default, authController_1.default.getCurrentUser);
exports.default = router;
