/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CreditCard, QrCode, Barcode, Wallet, Receipt, Banknote } from 'lucide-react';
import { PaymentData, PaymentMethod, PaymentDetails, Address } from '../../types';
import styles from './PaymentModal.module.scss';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatCurrency';
import { authService } from '../../services/authService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  address: Address;
  onPaymentComplete: (paymentData: PaymentData) => Promise<void>;
}

export function PaymentModal({ isOpen, onClose, total, address, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        // Verificar token antes de fazer a requisição
        const token = authService.getToken();
        if (!token) {
          toast.error('Sua sessão expirou. Por favor, faça login novamente.');
          onClose();
          return;
        }

        const details = await orderService.getPaymentDetails(total);
        setPaymentDetails(details);
      } catch (error: any) {
        console.error('Erro ao carregar detalhes do pagamento:', error);
        const message = error.response?.data?.message || 'Erro ao carregar opções de pagamento';
        toast.error(message);
        onClose();
      }
    };

    if (isOpen && total > 0) {
      loadPaymentDetails();
    }
  }, [isOpen, total, onClose]);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const paymentData: PaymentData = {
        method: selectedMethod,
        ...(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD' ? {
          cardNumber,
          cardHolder,
          expiryDate,
          cvv,
          ...(selectedMethod === 'CREDIT_CARD' ? { installments } : {})
        } : {})
      };

      await onPaymentComplete(paymentData);
      onClose();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !paymentDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Finalizar Pagamento</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
            <div className="space-y-4">
              <button
                className={`w-full p-4 rounded-lg border ${
                  selectedMethod === 'CREDIT_CARD'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedMethod('CREDIT_CARD')}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Cartão de Crédito</span>
                </div>
              </button>

              <button
                className={`w-full p-4 rounded-lg border ${
                  selectedMethod === 'DEBIT_CARD'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedMethod('DEBIT_CARD')}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Cartão de Débito</span>
                </div>
              </button>

              <button
                className={`w-full p-4 rounded-lg border ${
                  selectedMethod === 'PIX'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedMethod('PIX')}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <span>PIX</span>
                </div>
              </button>

              <button
                className={`w-full p-4 rounded-lg border ${
                  selectedMethod === 'BOLETO'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedMethod('BOLETO')}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <span>Boleto</span>
                </div>
              </button>
            </div>

            {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full p-2 border rounded"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full p-2 border rounded"
                    placeholder="NOME COMPLETO"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Data de Validade
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder="MM/AA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))
                      }
                      className="w-full p-2 border rounded"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                {selectedMethod === 'CREDIT_CARD' && paymentDetails?.CREDIT_CARD && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parcelas
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    >
                      {paymentDetails.CREDIT_CARD.installments.map(({ quantity, value }) => (
                        <option key={quantity} value={quantity}>
                          {quantity}x de {formatCurrency(value)}
                          {quantity === 1 ? ' (sem juros)' : ' (com juros)'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'PIX' && paymentDetails?.PIX && (
              <div className="mt-6 text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <img src={paymentDetails.PIX.qrCodeUrl} alt="QR Code PIX" width="200" height="200" />
                </div>
                <p className="text-sm text-gray-600">
                  Escaneie o QR Code acima com seu aplicativo de pagamento
                </p>
              </div>
            )}

            {selectedMethod === 'BOLETO' && paymentDetails?.BOLETO && (
              <div className="mt-6">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-center font-mono break-all">
                    {paymentDetails.BOLETO.barCode}
                  </p>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Copie o código acima para pagar no seu banco
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
            <div className="space-y-4">
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Endereço de Entrega</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{address.street}, {address.number}</p>
                  {address.complement && <p>{address.complement}</p>}
                  <p>{address.neighborhood}</p>
                  <p>{address.city} - {address.state}</p>
                  <p>CEP: {address.postalCode}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="px-6 py-2 border rounded-lg"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
}