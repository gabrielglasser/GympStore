import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { CartItem } from '../../types';
import styles from './Cart.module.scss';
import toast from 'react-hot-toast';

interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, updateQuantity, removeFromCart, loading } = useCart();
  const [address, setAddress] = useState<Address>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para acessar o carrinho');
    }
  }, [isAuthenticated, navigate]);

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const subtotal = calculateTotal(items);
  const shipping = subtotal > 200 ? 0 : 15.90;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader className={styles.spinner} />
        <span>Carregando carrinho...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.cart}>
        <div className="container mx-auto px-4">
          <div className={styles.emptyCart}>
            <div className={styles.icon}>
              <ShoppingCart size={48} />
            </div>
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione produtos ao seu carrinho para continuar comprando</p>
            <Link to="/produtos">
              <Button>Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <div className="container mx-auto px-4">
        <div className={styles.header}>
          <h1>Carrinho de Compras</h1>
        </div>

        <div className={styles.content}>
          <div>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className={styles.image} 
                  />
                  <div className={styles.info}>
                    <h3 className={styles.title}>{item.product.name}</h3>
                    {item.product.flavor && (
                      <div className={styles.details}>
                        <p>Sabor: {item.product.flavor}</p>
                      </div>
                    )}
                    <div className={styles.price}>
                      R$ {item.product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className={styles.remove}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.address}>
              <h3>Endereço de Entrega</h3>
              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="cep">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    value={address.cep}
                    onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                    placeholder="00000-000"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="street">Rua</label>
                  <input
                    type="text"
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="number">Número</label>
                    <input
                      type="text"
                      id="number"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="complement">Complemento</label>
                    <input
                      type="text"
                      id="complement"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="neighborhood">Bairro</label>
                  <input
                    type="text"
                    id="neighborhood"
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">Cidade</label>
                    <input
                      type="text"
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">Estado</label>
                    <input
                      type="text"
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.summary}>
            <h2>Resumo do Pedido</h2>
            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Frete</span>
              <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <Button className={styles.checkout}>
              Finalizar Compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;