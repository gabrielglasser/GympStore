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
    // 1. Verifica se o header existe
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Formato de token inválido');
    }

    // 2. Extrai o token
    const token = authHeader.split(' ')[1];
    
    // 3. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // 4. Busca o usuário SEM a senha
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
    console.error('Erro na autenticação:', error); // Log detalhado
    
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expirado'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Token inválido'));
    }
    next(error);
  }
};

export default authMiddleware;