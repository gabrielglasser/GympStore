import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_super_secreto";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

class AuthService {
  async login(email: string, password: string): Promise<{ token: string, user: any }> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ApiError(401, "Credenciais inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(401, "Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: parseInt(JWT_EXPIRES_IN || "3600") }
    );

    // Remove a senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        addresses: true
      }
    });

    if (!user) {
      throw new ApiError(404, "Usuário não encontrado");
    }

    return user;
  }
}

export default new AuthService();