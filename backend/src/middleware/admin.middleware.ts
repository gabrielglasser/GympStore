import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Acesso negado - Requer privilégios de administrador");
  }
  next();
};

export default adminMiddleware;