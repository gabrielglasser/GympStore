import { User, Address as PrismaAddress } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type UserWithAddresses = Prisma.UserGetPayload<{
  include: {
    addresses: true;
  };
}>;

export type AddressWithUser = Prisma.AddressGetPayload<{
  include: {
    user: true;
  };
}>;

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateAddressInput {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}