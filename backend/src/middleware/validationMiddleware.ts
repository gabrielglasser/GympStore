import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import ApiError from "../utils/apiError";

const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica se o corpo da requisição está vazio
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "O corpo da requisição não pode estar vazio");
      }

      // Converte o corpo para o schema esperado
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => {
          return `${err.path.join('.')}: ${err.message}`;
        });
        throw new ApiError(400, errorMessages.join(', '));
      }

      // Atribui os dados validados ao request
      req.body = result.data;
      next();
    } catch (error: any) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(new ApiError(400, 'Erro de validação'));
      }
    }
  };
};

export default validate;