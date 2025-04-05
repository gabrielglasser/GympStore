import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno no servidor'
  });
};

export default errorMiddleware;