import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      image: string; 
      flavor?: string;
      stock: number;
    };
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <img 
          src={item.product.image || 'https://res.cloudinary.com/dpenlfh9l/image/upload/v1/gymp/no-image-placeholder.jpg'} 
          alt={item.product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://res.cloudinary.com/dpenlfh9l/image/upload/v1/gymp/no-image-placeholder.jpg';
          }}
        />
      </div>

      <div className={styles.details}>
        <h3>{item.product.name}</h3>
        {item.product.flavor && (
          <p className={styles.flavor}>Sabor: {item.product.flavor}</p>
        )}
        <p className={styles.price}>{formatCurrency(item.product.price)}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            onClick={() => handleUpdateQuantity(Math.max(0, item.quantity - 1))}
            disabled={loading || item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={loading || item.quantity >= item.product.stock}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          className={styles.removeButton}
          onClick={handleRemove}
          disabled={loading}
        >
          <Trash2 size={16} />
          <span>Remover</span>
        </button>
      </div>
    </div>
  );
}