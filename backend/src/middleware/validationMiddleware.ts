import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import ApiError from "../utils/apiError";

const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err: any) => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        next(new ApiError(400, errorMessages.join(', ')));
      } else {
        next(new ApiError(400, 'Erro de validação'));
      }
    }
  };
};

export default validate;