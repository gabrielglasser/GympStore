import { PrismaClient, Address, User } from "@prisma/client";
import ApiError from "../utils/apiError";
import { AddressWithUser, CreateAddressInput, UpdateAddressInput } from "../models/userModel";

const prisma = new PrismaClient();

type AddressWithUserPrisma = Address & {
  user: User;
};

class AddressService {
  private mapToAddressWithUser(address: AddressWithUserPrisma): AddressWithUser {
    return {
      id: address.id,
      userId: address.userId,
      postalCode: address.postalCode,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      user: {
        id: address.user.id,
        name: address.user.name,
        email: address.user.email
      }
    };
  }

  async getAddressesByUserId(userId: string): Promise<AddressWithUser[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      include: {
        user: true
      }
    });

    return addresses.map(this.mapToAddressWithUser);
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

    return this.mapToAddressWithUser(address as AddressWithUserPrisma);
  }

  async getDefaultAddress(userId: string): Promise<AddressWithUser | null> {
    const address = await prisma.address.findFirst({
      where: { 
        userId,
        isDefault: true
      },
      include: {
        user: true
      }
    });

    if (!address) {
      // Se não encontrar endereço padrão, retorna o primeiro endereço do usuário
      const firstAddress = await prisma.address.findFirst({
        where: { userId },
        include: {
          user: true
        }
      });

      if (!firstAddress) {
        return null;
      }

      return this.mapToAddressWithUser(firstAddress as AddressWithUserPrisma);
    }

    return this.mapToAddressWithUser(address as AddressWithUserPrisma);
  }

  async createAddress(userId: string, input: CreateAddressInput): Promise<AddressWithUser> {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userExists) {
      throw new ApiError(404, "Usuário não encontrado");
    }

    if (!input.postalCode || !input.street || !input.city || !input.state) {
      throw new ApiError(400, "Todos os campos obrigatórios devem ser preenchidos");
    }

    const userAddresses = await this.getAddressesByUserId(userId);
    const isDefault = userAddresses.length === 0 ? true : input.isDefault || false;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const result = await prisma.address.create({
      data: {
        userId,
        postalCode: input.postalCode,
        street: input.street,
        city: input.city,
        state: input.state,
        isDefault
      },
      include: {
        user: true
      }
    });

    return this.mapToAddressWithUser(result as AddressWithUserPrisma);
  }

  async updateAddress(input: UpdateAddressInput): Promise<AddressWithUser> {
    const addressExists = await prisma.address.findUnique({
      where: { id: input.id },
      include: {
        user: true
      }
    });

    if (!addressExists) {
      throw new ApiError(404, "Endereço não encontrado");
    }

    const data = { ...input } as Partial<UpdateAddressInput>;
    delete data.id;

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

    const result = await prisma.address.update({
      where: { id: input.id },
      data,
      include: {
        user: true
      }
    });

    return this.mapToAddressWithUser(result as AddressWithUserPrisma);
  }

  async deleteAddress(id: string): Promise<void> {
    const addressExists = await prisma.address.findUnique({
      where: { id }
    });

    if (!addressExists) {
      throw new ApiError(404, "Endereço não encontrado");
    }

    await prisma.address.delete({
      where: { id }
    });
  }
}

export default new AddressService();