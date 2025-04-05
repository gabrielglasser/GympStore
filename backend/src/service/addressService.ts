import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import { AddressWithUser, CreateAddressInput, UpdateAddressInput } from "../models/userModel";

const prisma = new PrismaClient();

class AddressService {
  async getAddressesByUserId(userId: string): Promise<AddressWithUser[]> {
    return await prisma.address.findMany({
      where: { userId },
      include: {
        user: true
      }
    });
  }

  async getAddressById(id: string): Promise<AddressWithUser> {
    const address = await prisma.address.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!address) {
      throw new ApiError(404, "Endereço não encontrado");
    }

    return address;
  }

  async createAddress(userId: string, input: CreateAddressInput): Promise<AddressWithUser> {
    // Verifica se o usuário existe
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!userExists) {
        throw new ApiError(404, "Usuário não encontrado");
    }

    // Se for o primeiro endereço, define como padrão
    const userAddresses = await this.getAddressesByUserId(userId);
    const isDefault = userAddresses.length === 0 ? true : input.isDefault || false;

    // Se definido como padrão, remove o padrão dos outros endereços
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
        });
    }

    // Cria o endereço CORRETAMENTE
    return await prisma.address.create({
        data: {
            ...input,
            userId, 
            isDefault,
            country: input.country || "Brasil"
        },
        include: {
            user: true
        }
    });
}

  async updateAddress(input: UpdateAddressInput): Promise<AddressWithUser> {
    const addressExists = await prisma.address.findUnique({
      where: { id: input.id }
    });

    if (!addressExists) {
      throw new ApiError(404, "Endereço não encontrado");
    }

    const data: any = { ...input };
    delete data.id;

    // Se estiver marcando como padrão, atualiza os outros
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: addressExists.userId,
          isDefault: true,
          NOT: { id: input.id }
        },
        data: { isDefault: false }
      });
    }

    return await prisma.address.update({
      where: { id: input.id },
      data,
      include: {
        user: true
      }
    });
  }

  async deleteAddress(id: string): Promise<void> {
    const addressExists = await prisma.address.findUnique({
      where: { id }
    });

    if (!addressExists) {
      throw new ApiError(404, "Endereço não encontrado");
    }

    // Se for o endereço padrão, define outro como padrão
    if (addressExists.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: {
          userId: addressExists.userId,
          NOT: { id }
        }
      });

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true }
        });
      }
    }

    await prisma.address.delete({
      where: { id }
    });
  }
}

export default new AddressService();