export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentDetails {
  CREDIT_CARD: {
    maxInstallments: number;
    minInstallmentValue: number;
    installments: Array<{
      quantity: number;
      value: number;
      total: number;
    }>;
  };
  DEBIT_CARD: {
    banks: string[];
  };
  PIX: {
    qrCodeUrl: string;
    expiresIn: number;
  };
  BOLETO: {
    barCode: string;
    expiresIn: number;
  };
}