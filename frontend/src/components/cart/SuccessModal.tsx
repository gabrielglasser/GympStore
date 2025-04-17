import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import styles from './SuccessModal.module.scss';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function SuccessModal({ isOpen, onClose, orderId }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.content}>
          <div className={styles.icon}>
            <CheckCircle size={48} className={styles.checkIcon} />
          </div>

          <h2>Pedido Realizado com Sucesso!</h2>
          
          <p>
            Seu pedido foi confirmado e está sendo processado.
            <br />
            O número do seu pedido é:
          </p>
          
          <code className={styles.orderId}>{orderId}</code>
          
          <p>
            Você receberá um e-mail com os detalhes do pedido e
            informações sobre o status da entrega.
          </p>

          <button className={styles.button} onClick={onClose}>
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
} 