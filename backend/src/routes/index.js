"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productRoute_1 = __importDefault(require("./productRoute"));
const categoryRoute_1 = __importDefault(require("./categoryRoute"));
const cartRoute_1 = __importDefault(require("./cartRoute"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoute_1 = __importDefault(require("./userRoute"));
const router = (0, express_1.Router)();
router.use("/products", productRoute_1.default);
router.use("/categories", categoryRoute_1.default);
router.use("/cart", cartRoute_1.default);
router.use("/auth", authRoutes_1.default);
router.use("/users", userRoute_1.default);
exports.default = router;
