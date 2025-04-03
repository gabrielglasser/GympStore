import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types/customRequest";

const prisma = new PrismaClient();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Não autorizado - Token não fornecido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new ApiError(401, 'Não autorizado - Usuário não encontrado');
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;