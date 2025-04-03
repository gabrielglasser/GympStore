import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import { CartWithItems, CartItemWithProduct, AddToCartInput, UpdateCartItemInput } from "../models/cartModel";

const prisma = new PrismaClient();

class CartService {
  async getCartByUserId(userId: string): Promise<CartWithItems> {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, input: AddToCartInput): Promise<CartWithItems> {
    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new ApiError(404, "Produto não encontrado");
    }

    // Verifica se há estoque disponível
    if (product.stock < input.quantity) {
      throw new ApiError(400, "Quantidade solicitada não disponível em estoque");
    }

    // Obtém ou cria o carrinho
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Verifica se o item já está no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: input.productId,
      },
    });

    if (existingItem) {
      // Atualiza a quantidade se o item já existir
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + input.quantity,
        },
      });
    } else {
      // Adiciona novo item ao carrinho
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: input.productId,
          quantity: input.quantity,
        },
      });
    }

    // Retorna o carrinho atualizado
    return this.getCartByUserId(userId);
  }

  async updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput): Promise<CartWithItems> {
    // Verifica se o item pertence ao carrinho do usuário
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new ApiError(404, "Carrinho não encontrado");
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new ApiError(404, "Item não encontrado no carrinho");
    }

    // Verifica se há estoque disponível
    if (cartItem.product.stock < input.quantity) {
      throw new ApiError(400, "Quantidade solicitada não disponível em estoque");
    }

    // Atualiza a quantidade
    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: input.quantity,
      },
    });

    return this.getCartByUserId(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<CartWithItems> {
    // Verifica se o item pertence ao carrinho do usuário
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new ApiError(404, "Carrinho não encontrado");
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new ApiError(404, "Item não encontrado no carrinho");
    }

    // Remove o item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCartByUserId(userId);
  }

  async clearCart(userId: string): Promise<CartWithItems> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new ApiError(404, "Carrinho não encontrado");
    }

    // Remove todos os itens do carrinho
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCartByUserId(userId);
  }
}

export default new CartService();