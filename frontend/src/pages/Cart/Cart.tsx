/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { PaymentModal } from '../../components/cart/PaymentModal';
import { SuccessModal } from '../../components/ui/SuccessModal/SuccessModal';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { CartItem, PaymentData, Address } from '../../types';
import { correiosService } from '../../services/correiosService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import styles from './Cart.module.scss';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para acessar o carrinho');
      return;
    }
  }, [isAuthenticated, navigate]);

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const total = calculateTotal(items);

  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let postalCode = e.target.value.replace(/\D/g, '');
    postalCode = postalCode.replace(/(\d{5})(\d)/, '$1-$2');
    setAddress(prev => ({ ...prev, postalCode }));

    if (postalCode.replace(/\D/g, '').length === 8) {
      try {
        setLoadingCep(true);
        const endereco = await correiosService.consultarCep(postalCode);

        setAddress(prev => ({
          ...prev,
          street: endereco.logradouro,
          city: endereco.localidade,
          state: endereco.uf
        }));
      } catch (error) {
        console.error('Erro na busca do CEP:', error);
        toast.error('CEP não encontrado');
        setAddress(prev => ({
          ...prev,
          street: '',
          city: '',
          state: ''
        }));
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoadingItems(prev => ({ ...prev, [itemId]: true }));
      await updateQuantity(itemId, quantity);
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      setLoadingItems(prev => ({ ...prev, [itemId]: true }));
      await removeFromCart(itemId);
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleFinishPurchase = async (paymentData: PaymentData) => {
    try {
      if (!address.postalCode || !address.street || !address.city || !address.state) {
        toast.error('Por favor, preencha todos os campos do endereço');
        return;
      }

      let addressId = address.id;
      try {
        if (!addressId) {
          const savedAddress = await addressService.saveAddress({
            ...address,
            isDefault: true
          });
          addressId = savedAddress.id;
        }
      } catch (error: any) {
        console.error('Erro ao salvar endereço:', error);
        toast.error('Erro ao salvar endereço. Por favor, tente novamente.');
        return;
      }

      if (!addressId) {
        toast.error('Erro ao processar endereço. Por favor, tente novamente.');
        return;
      }
      try {
        const order = await orderService.createOrder({
          addressId,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          })),
          payment: paymentData
        });

        await clearCart();
        setShowPaymentModal(false);
        setOrderId(order.id);
        setShowSuccessModal(true);
        
        setAddress({
          street: '',
          city: '',
          state: '',
          postalCode: ''
        });

      } catch (error: any) {
        console.error('Erro ao criar pedido:', error);
        toast.error('Erro ao finalizar compra. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      toast.error('Erro ao finalizar compra. Por favor, tente novamente.');
    }
  };

  const handleOpenPaymentModal = () => {
    if (!address.postalCode || !address.street || !address.city || !address.state) {
      toast.error('Por favor, preencha todos os campos do endereço');
      return;
    }
    setShowPaymentModal(true);
  };

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
    <>
      <div className={styles.cart}>
        <div className="container">
          <div className={styles.header}>
            <h1>Carrinho de Compras</h1>
          </div>

          <div className={styles.content}>
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
                        onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        disabled={loadingItems[item.id] || item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span>
                        {loadingItems[item.id] ? (
                          <span className={styles.loadingItem}>
                            <Loader className={styles.spinner} size={14} />
                          </span>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={loadingItems[item.id] || item.quantity >= item.product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className={styles.remove}
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={loadingItems[item.id]}
                    >
                      <Trash2 size={16} />
                      {loadingItems[item.id] ? 'Removendo...' : 'Remover'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2>Resumo do Pedido</h2>
              <div className={`${styles.summaryItem} ${styles.total}`}>
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className={styles.address}>
                <h3>Endereço de Entrega</h3>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="postalCode">CEP</label>
                    <div className={styles.postalCodeInput}>
                      <input
                        type="text"
                        id="postalCode"
                        value={address.postalCode}
                        onChange={handlePostalCodeChange}
                        placeholder="00000-000"
                      />
                      {loadingCep && <Loader className={styles.spinner} size={14} />}
                    </div>
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
              <Button 
                className={styles.checkout}
                onClick={handleOpenPaymentModal}
                disabled={!address.postalCode}
              >
                Finalizar Compra
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleFinishPurchase}
          address={address}
          total={total}
        />
      )}

      {showSuccessModal && (
        <SuccessModal orderId={orderId} />
      )}
    </>
  );
};

export default Cart;