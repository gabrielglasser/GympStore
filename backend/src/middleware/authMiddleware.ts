import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Interface local para garantir a tipagem
interface AuthenticatedRequest extends Request {
  user?: any; 
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Não autorizado - Formato de token inválido');
    }

    const token = authHeader.split(' ')[1];
    
    // Verificação do token com tratamento de erros específico
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Sessão expirada - Faça login novamente');
      }
      throw new ApiError(401, 'Não autorizado - Token inválido');
    }

    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      throw new ApiError(401, 'Não autorizado - Usuário não encontrado');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.error('Erro no authMiddleware:', error);
      next(new ApiError(500, 'Erro durante a autenticação'));
    }
  }
};

export default authMiddleware;