import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import { UserWithAddresses, CreateUserInput, UpdateUserInput } from "../models/userModel";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

class UserService {
  async getAllUsers(): Promise<UserWithAddresses[]> {
    return await prisma.user.findMany({
      include: {
        addresses: true
      }
    });
  }

  async getUserById(id: string): Promise<UserWithAddresses> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true
      }
    });

    if (!user) {
      throw new ApiError(404, "Usuário não encontrado");
    }

    return user;
  }

  async createUser(input: CreateUserInput): Promise<UserWithAddresses> {
    const emailExists = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (emailExists) {
      throw new ApiError(400, "Email já está em uso");
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    return await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
        role: "USER" // Definindo role padrão
      },
      include: {
        addresses: true
      }
    });
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<UserWithAddresses> {
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      throw new ApiError(404, "Usuário não encontrado");
    }

    const data: any = { ...input };

    if (input.password) {
      data.password = await bcrypt.hash(input.password, SALT_ROUNDS);
    }

    return await prisma.user.update({
      where: { id },
      data,
      include: {
        addresses: true
      }
    });
  }
  async deleteUser(id: string): Promise<void> {
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      throw new ApiError(404, "Usuário não encontrado");
    }

    await prisma.user.delete({
      where: { id }
    });
  }
}

export default new UserService();