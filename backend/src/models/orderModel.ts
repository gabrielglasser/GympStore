import { OrderStatus, Prisma, PaymentMethod } from "@prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
    address: true;
    payment: true;
    user: true;
  };
}>;

export interface CreateOrderInput {
  userId: string;
  addressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  payment: {
    method: PaymentMethod;
    installments?: number;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    bank?: string;
  };
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentId?: string;
}