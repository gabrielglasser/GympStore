import { PaymentDetails } from "../models/paymentModel";
import { generateRandomString } from "../utils/stringUtils";
import ApiError from "../utils/apiError";

export class PaymentService {
  async getPaymentDetails(total: number): Promise<PaymentDetails> {
    try {
      const installments = this.calculateInstallments(total);
      
      return {
        CREDIT_CARD: {
          maxInstallments: 12,
          minInstallmentValue: 5,
          installments
        },
        DEBIT_CARD: {
          banks: ['Banco do Brasil', 'Bradesco', 'Itaú', 'Santander', 'Nubank']
        },
        PIX: {
          qrCodeUrl: this.generatePixQRCode(),
          expiresIn: 15 
        },
        BOLETO: {
          barCode: this.generateBoletoBarCode(),
          expiresIn: 3 
        }
      };
    } catch (error) {
      throw new ApiError(500, "Erro ao processar detalhes de pagamento");
    }
  }

  async processPayment(payment: any, total: number): Promise<any> {
    switch (payment.method) {
      case 'CREDIT_CARD':
        if (!payment.cardNumber || !payment.cardHolder || !payment.expiryDate || !payment.cvv) {
          throw new ApiError(400, "Dados do cartão de crédito incompletos");
        }
        break;
      case 'DEBIT_CARD':
        if (!payment.bank) {
          throw new ApiError(400, "Banco não selecionado");
        }
        break;
      case 'PIX':
        payment.qrCode = this.generatePixQRCode();
        payment.expiresIn = 15; 
        break;
      case 'BOLETO':
        payment.barCode = this.generateBoletoBarCode();
        payment.expiresIn = 3; 
        break;
      default:
        throw new ApiError(400, "Método de pagamento inválido");
    }

    return {
      status: 'PENDING',
      method: payment.method,
      details: payment
    };
  }

  private calculateInstallments(total: number) {
    const installments = [];
    const maxInstallments = Math.min(12, Math.floor(total / 5));

    for (let i = 1; i <= maxInstallments; i++) {
      installments.push({
        quantity: i,
        value: total / i,
        total: total
      });
    }

    return installments;
  }

  private generatePixQRCode(): string {
    return `PIX-${generateRandomString(32)}`;
  }

  private generateBoletoBarCode(): string {
    return `34191.79001 01043.510047 91020.150008 4 ${generateRandomString(14)}`;
  }
}