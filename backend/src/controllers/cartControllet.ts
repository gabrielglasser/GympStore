import { Request, Response } from "express";
import CartService from "../service/cartService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/customRequest";
import { AddToCartInput, UpdateCartItemInput } from "../models/cartModel";

class CartController {
  async getCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const cart = await CartService.getCartByUserId(userId);
    ApiResponse.success(res, cart);
  }

  async addToCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const cart = await CartService.addToCart(userId, req.body);
    ApiResponse.success(res, cart);
  }

  async updateCartItem(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const cart = await CartService.updateCartItem(
      userId,
      req.params.itemId,
      req.body
    );
    ApiResponse.success(res, cart);
  }

  async removeFromCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const cart = await CartService.removeFromCart(userId, req.params.itemId);
    ApiResponse.success(res, cart);
  }

  async clearCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const cart = await CartService.clearCart(userId);
    ApiResponse.success(res, cart);
  }
}

export default {
  getCart: asyncHandler(new CartController().getCart),
  addToCart: asyncHandler(new CartController().addToCart),
  updateCartItem: asyncHandler(new CartController().updateCartItem),
  removeFromCart: asyncHandler(new CartController().removeFromCart),
  clearCart: asyncHandler(new CartController().clearCart),
};