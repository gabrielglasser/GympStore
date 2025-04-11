import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_super_secreto"; // Garante que temos um valor

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Verifica se o header existe
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token não fornecido');
    }

    // 2. Extrai o token
    const token = authHeader.split(' ')[1];
    
    // 3. Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // 4. Busca o usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      throw new ApiError(401, 'Usuário não encontrado');
    }

    // 5. Adiciona o usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Token inválido'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expirado'));
    }
    next(error);
  }
};

export default authMiddleware;