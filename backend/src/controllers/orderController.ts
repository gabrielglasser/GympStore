import { Response } from "express";
import OrderService from "../service/orderService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/customRequest";
import { CreateOrderInput } from "../models/orderModel";
import ApiError from "../utils/apiError";

class OrderController {
  async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const order = await OrderService.createOrder({ userId, ...req.body });
    ApiResponse.created(res, order);
  }

  async getOrder(req: AuthenticatedRequest, res: Response) {
    const order = await OrderService.getOrderById(req.params.id);
    
    // Verifica se o usuário é dono do pedido ou admin
    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      throw new ApiError(403, "Acesso não autorizado");
    }
    
    ApiResponse.success(res, order);
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response) {
    const orders = await OrderService.getUserOrders(req.user.id);
    ApiResponse.success(res, orders);
  }

  async updateOrder(req: AuthenticatedRequest, res: Response) {
    // Apenas admin pode atualizar pedidos
    if (req.user.role !== "ADMIN") {
      throw new ApiError(403, "Acesso não autorizado");
    }
    
    const order = await OrderService.updateOrder(req.params.id, req.body);
    ApiResponse.success(res, order);
  }
}

export default {
  createOrder: asyncHandler(new OrderController().createOrder),
  getOrder: asyncHandler(new OrderController().getOrder),
  getUserOrders: asyncHandler(new OrderController().getUserOrders),
  updateOrder: asyncHandler(new OrderController().updateOrder)
};