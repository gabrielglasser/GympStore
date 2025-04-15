/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CreditCard, Wallet, QrCode, Receipt } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { PaymentData, PaymentMethod, PaymentDetails } from '../../types';
import { Address } from '../../types';
import styles from './PaymentModal.module.scss';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  onClose: () => void;
  onConfirm: (paymentData: PaymentData) => Promise<void>;
  address: Address;
  total: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onConfirm,
  address,
  total
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    CREDIT_CARD: {
      maxInstallments: 12,
      minInstallmentValue: 5,
      installments: []
    },
    DEBIT_CARD: {
      banks: []
    },
    PIX: {
      qrCodeUrl: '',
      expiresIn: 15
    },
    BOLETO: {
      barCode: '',
      expiresIn: 3
    }
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'CREDIT_CARD',
    installments: 1
  });

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        const details = await orderService.getPaymentDetails(total);
        if (details) {
          setPaymentDetails(details);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes de pagamento:', error);
        toast.error('Erro ao carregar detalhes de pagamento');
      }
    };

    loadPaymentDetails();
  }, [total]);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentData({ 
      method,
      installments: method === 'CREDIT_CARD' ? 1 : undefined,
      cardNumber: undefined,
      cardHolder: undefined,
      expiryDate: undefined,
      cvv: undefined,
      bank: undefined
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMethod === 'CREDIT_CARD') {
      if (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiryDate || !paymentData.cvv) {
        toast.error('Preencha todos os campos do cartão de crédito');
        return;
      }
    } else if (selectedMethod === 'DEBIT_CARD') {
      if (!paymentData.bank) {
        toast.error('Selecione um banco');
        return;
      }
    }

    setLoading(true);
    try {
      await onConfirm({
        ...paymentData,
        method: selectedMethod
      });
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const renderInstallments = () => {
    if (!paymentDetails?.CREDIT_CARD) {
      return (
        <option value="1">1x de R$ {total.toFixed(2)} sem juros</option>
      );
    }

    const { maxInstallments } = paymentDetails.CREDIT_CARD;
    const installments = [];
    
    for (let i = 1; i <= maxInstallments; i++) {
      const value = total / i;
      installments.push(
        <option key={i} value={i}>
          {i}x de R$ {value.toFixed(2)} sem juros
        </option>
      );
    }

    return installments;
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'CREDIT_CARD':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Número do Cartão</label>
              <input
                type="text"
                value={paymentData.cardNumber || ''}
                onChange={e => setPaymentData({ 
                  ...paymentData, 
                  cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
                })}
                placeholder="4111 1111 1111 1111"
                maxLength={19}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nome no Cartão</label>
              <input
                type="text"
                value={paymentData.cardHolder || ''}
                onChange={e => setPaymentData({ ...paymentData, cardHolder: e.target.value.toUpperCase() })}
                placeholder="NOME COMO ESTÁ NO CARTÃO"
                required
              />
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Validade</label>
                <input
                  type="text"
                  value={paymentData.expiryDate || ''}
                  onChange={e => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  value={paymentData.cvv || ''}
                  onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Parcelas</label>
              <select
                value={paymentData.installments}
                onChange={e => setPaymentData({ ...paymentData, installments: Number(e.target.value) })}
                required
              >
                {renderInstallments()}
              </select>
            </div>
          </>
        );

      case 'DEBIT_CARD':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Banco</label>
              <select 
                value={paymentData.bank || ''}
                onChange={e => setPaymentData({ ...paymentData, bank: e.target.value })}
                required
              >
                <option value="">Selecione um banco</option>
                {paymentDetails?.DEBIT_CARD?.banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          </>
        );

      case 'PIX':
        return (
          <div className={styles.pixContainer}>
            {paymentDetails?.PIX?.qrCodeUrl ? (
              <>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentDetails.PIX.qrCodeUrl}`} 
                  alt="QR Code PIX" 
                />
                <p>Escaneie o QR Code para pagar</p>
                <p>Expira em: {paymentDetails.PIX.expiresIn} minutos</p>
              </>
            ) : (
              <p>Carregando QR Code...</p>
            )}
          </div>
        );

      case 'BOLETO':
        return (
          <div className={styles.boletoContainer}>
            {paymentDetails?.BOLETO?.barCode ? (
              <>
                <p>Código do Boleto:</p>
                <code>{paymentDetails.BOLETO.barCode}</code>
                <p>Vencimento em: {paymentDetails.BOLETO.expiresIn} dias</p>
              </>
            ) : (
              <p>Carregando código do boleto...</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.content}>
          <h2>Finalizar Compra</h2>
          
          <div className={styles.warning}>
            <AlertCircle size={20} />
            <p>Este é um ambiente de testes. Não insira dados reais de cartão de crédito.</p>
          </div>

          <div className={styles.orderSummary}>
            <h3>Resumo do Pedido</h3>
            <div className={styles.total}>
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <div className={styles.address}>
              <h3>Endereço de Entrega</h3>
              <p>{address.street}</p>
              <p>{address.city} - {address.state}</p>
              <p>CEP: {address.postalCode}</p>
            </div>
          </div>

          <div className={styles.paymentMethods}>
            <button
              className={`${styles.methodButton} ${selectedMethod === 'CREDIT_CARD' ? styles.active : ''}`}
              onClick={() => handleMethodChange('CREDIT_CARD')}
            >
              <CreditCard size={24} />
              <span>Cartão de Crédito</span>
            </button>

            <button
              className={`${styles.methodButton} ${selectedMethod === 'DEBIT_CARD' ? styles.active : ''}`}
              onClick={() => handleMethodChange('DEBIT_CARD')}
            >
              <Wallet size={24} />
              <span>Cartão de Débito</span>
            </button>

            <button
              className={`${styles.methodButton} ${selectedMethod === 'PIX' ? styles.active : ''}`}
              onClick={() => handleMethodChange('PIX')}
            >
              <QrCode size={24} />
              <span>PIX</span>
            </button>

            <button
              className={`${styles.methodButton} ${selectedMethod === 'BOLETO' ? styles.active : ''}`}
              onClick={() => handleMethodChange('BOLETO')}
            >
              <Receipt size={24} />
              <span>Boleto</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {renderPaymentForm()}
            
            <Button 
              type="submit" 
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Processando...' : 'Finalizar Compra'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};