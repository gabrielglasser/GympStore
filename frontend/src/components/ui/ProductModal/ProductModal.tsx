import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import { Product } from '../../../types';
import styles from './ProductModal.module.scss';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://res.cloudinary.com/dpenlfh9l/image/upload/v1/gymp/no-image-placeholder.jpg';
              }}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.category}>{product.category.name}</div>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.details}>
              <div className={styles.detail}>
                <div className={styles.label}>Marca</div>
                <div className={styles.value}>{product.brand}</div>
              </div>
              {product.flavor && (
                <div className={styles.detail}>
                  <div className={styles.label}>Sabor</div>
                  <div className={styles.value}>{product.flavor}</div>
                </div>
              )}
              <div className={styles.detail}>
                <div className={styles.label}>Peso</div>
                <div className={styles.value}>{product.weight}g</div>
              </div>
              <div className={styles.detail}>
                <div className={styles.label}>Estoque</div>
                <div className={styles.value}>{product.stock} unidades</div>
              </div>
            </div>

            <div className={styles.price}>
              R$ {product.price.toFixed(2)}
            </div>

            <Button
              className={styles.addToCart}
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto indisponível'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};