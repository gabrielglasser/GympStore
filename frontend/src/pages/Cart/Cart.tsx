import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { PaymentModal } from '../../components/cart/PaymentModal';
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

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddress = await addressService.getDefaultAddress();
        if (savedAddress) {
          setAddress(savedAddress);
        }
      } catch (error) {
        console.error('Erro ao carregar endereço:', error);
      }
    };

    if (isAuthenticated) {
      loadSavedAddress();
    }
  }, [isAuthenticated]);

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const total = calculateTotal(items);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, '');
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    setAddress(prev => ({ ...prev, cep }));

    if (cep.replace(/\D/g, '').length === 8) {
      try {
        setLoadingCep(true);
        const endereco = await correiosService.consultarCep(cep);

        setAddress(prev => ({
          ...prev,
          street: endereco.logradouro,
          neighborhood: endereco.bairro,
          city: endereco.localidade,
          state: endereco.uf
        }));
      } catch (error) {
        console.error('Erro na busca do CEP:', error);
        toast.error('CEP não encontrado');
        setAddress(prev => ({
          ...prev,
          street: '',
          neighborhood: '',
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
      if (!address.id) {
        const savedAddress = await addressService.saveAddress(address);
        address.id = savedAddress.id;
      }

      const order = await orderService.createOrder({
        addressId: address.id!,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        payment: {
          method: 'CREDIT_CARD',
          installments: paymentData.installments
        }
      });

      await clearCart();
      setShowPaymentModal(false);
      navigate(`/pedido/${order.id}`);
      toast.success('Pedido realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      toast.error('Erro ao finalizar compra. Tente novamente.');
    }
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

              <div className={styles.address}>
                <h3>Endereço de Entrega</h3>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="cep">CEP</label>
                    <input
                      type="text"
                      id="cep"
                      value={address.cep}
                      onChange={handleCepChange}
                      maxLength={9}
                      placeholder="00000-000"
                    />
                    {loadingCep && <span className={styles.loading}>Buscando CEP...</span>}
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
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <Button 
                className={styles.checkout}
                onClick={() => setShowPaymentModal(true)}
                disabled={!address.cep}
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
    </>
  );
};

export default Cart;