"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../utils/apiError"));
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Verifica se o corpo da requisição está vazio
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new apiError_1.default(400, "O corpo da requisição não pode estar vazio");
            }
            // Converte o corpo para o schema esperado
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errorMessages = result.error.errors.map((err) => {
                    return `${err.path.join('.')}: ${err.message}`;
                });
                throw new apiError_1.default(400, errorMessages.join(', '));
            }
            // Atribui os dados validados ao request
            req.body = result.data;
            next();
        }
        catch (error) {
            if (error instanceof apiError_1.default) {
                next(error);
            }
            else {
                next(new apiError_1.default(400, 'Erro de validação'));
            }
        }
    };
};
exports.default = validate;
