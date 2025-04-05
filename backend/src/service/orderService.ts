import { PrismaClient, OrderStatus } from "@prisma/client";
import ApiError from "../utils/apiError";
import { OrderWithItems, CreateOrderInput, UpdateOrderInput } from "../models/orderModel";

const prisma = new PrismaClient();

class OrderService {
  async createOrder(input: CreateOrderInput): Promise<OrderWithItems> {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: input.userId }
    });
    if (!user) throw new ApiError(404, "Usuário não encontrado");

    // Verifica se o endereço pertence ao usuário
    const address = await prisma.address.findFirst({
      where: { id: input.addressId, userId: input.userId }
    });
    if (!address) throw new ApiError(404, "Endereço não encontrado");

    // Verifica produtos e calcula total
    let total = 0;
    const orderItems = [];

    for (const item of input.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) throw new ApiError(404, `Produto ${item.productId} não encontrado`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Quantidade indisponível para o produto ${product.name}`);
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      // Atualiza estoque
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // Cria o pedido
    const order = await prisma.order.create({
      data: {
        userId: input.userId,
        addressId: input.addressId,
        total,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        user: true,
        payment: true
      }
    });

    return order;
  }

  async getOrderById(id: string): Promise<OrderWithItems> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        payment: true,
        user: true
      }
    });

    if (!order) throw new ApiError(404, "Pedido não encontrado");
    return order;
  }

  async updateOrder(id: string, input: UpdateOrderInput): Promise<OrderWithItems> {
    return await prisma.order.update({
      where: { id },
      data: input,
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        payment: true,
        user: true
      }
    });
  }

  async getUserOrders(userId: string): Promise<OrderWithItems[]> {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        payment: true,
        user: true 
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}

export default new OrderService();