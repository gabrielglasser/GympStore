import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './SuccessModal.module.scss';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  orderId: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <CheckCircle size={64} className={styles.icon} />
          <h2>Pedido Realizado com Sucesso!</h2>
          <p>Seu pedido #{orderId} foi confirmado</p>
          
          <div className={styles.actions}>
            <Button onClick={() => navigate('/pedidos')}>
              Acompanhar Pedido
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/produtos')}
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};