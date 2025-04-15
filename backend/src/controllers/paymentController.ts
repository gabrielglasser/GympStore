import { Request, Response } from "express";
import { PaymentService } from "../service/paymentService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  getPaymentDetails = async (req: Request, res: Response) => {
    try {
      const total = Number(req.query.total);

      if (isNaN(total) || total <= 0) {
        return ApiResponse.error(res, 400, "Valor total inválido");
      }

      const paymentDetails = await this.paymentService.getPaymentDetails(total);
      return ApiResponse.success(res, paymentDetails);
    } catch (error) {
      console.error('Erro ao buscar detalhes de pagamento:', error);
      return ApiResponse.error(res, 500, "Erro ao processar detalhes de pagamento");
    }
  };

  processPayment = async (req: Request, res: Response) => {
    try {
      const { payment, total } = req.body;
      const result = await this.paymentService.processPayment(payment, total);
      return ApiResponse.success(res, result);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return ApiResponse.error(res, 500, "Erro ao processar pagamento");
    }
  };
}

const paymentController = new PaymentController();

export default {
  getPaymentDetails: asyncHandler(paymentController.getPaymentDetails),
  processPayment: asyncHandler(paymentController.processPayment)
};