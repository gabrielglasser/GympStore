import { OrderStatus, Prisma } from "@prisma/client";

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
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentId?: string;
}