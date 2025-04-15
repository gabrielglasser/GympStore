import { User, Address as PrismaAddress } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type UserWithAddresses = Prisma.UserGetPayload<{
  include: {
    addresses: true;
  };
}>;

export interface AddressWithUser {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

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
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}