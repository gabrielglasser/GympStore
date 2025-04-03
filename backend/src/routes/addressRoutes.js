"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = __importDefault(require("../controllers/addressController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userValidation_1 = require("../validations/userValidation");
const router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(authMiddleware_1.default);
router.get("/", addressController_1.default.getAddressesByUser);
router.get("/:id", addressController_1.default.getAddressById);
router.post("/", (0, validationMiddleware_1.default)(userValidation_1.createAddressSchema), addressController_1.default.createAddress);
router.put("/:id", (0, validationMiddleware_1.default)(userValidation_1.updateAddressSchema), addressController_1.default.updateAddress);
router.delete("/:id", addressController_1.default.deleteAddress);
exports.default = router;
