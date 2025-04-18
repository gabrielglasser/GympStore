/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { PaymentModal } from '../../components/cart/PaymentModal';
import { SuccessModal } from '../../components/cart/SuccessModal';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { CartItem, PaymentData, Address } from '../../types';
import { correiosService } from '../../services/correiosService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { authService } from '../../services/authService';
import styles from './Cart.module.scss';
import toast from 'react-hot-toast';
import { CartItem as CartItemComponent } from '../../components/cart/CartItem';
import { AddressForm } from '../../components/address/AddressForm';

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
    postalCode: '',
    number: '',
    neighborhood: '',
  });

  useEffect(() => {
    const token = authService.getToken();
    if (!token || !isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para acessar o carrinho');
      return;
    }
  }, [isAuthenticated, navigate]);

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const total = calculateTotal(items);

  const handlePostalCodeChange = async (postalCode: string) => {
    if (postalCode.length === 9) { // Formato: 00000-000
      try {
        setLoadingCep(true);
        const cepLimpo = postalCode.replace(/\D/g, '');
        const endereco = await correiosService.consultarCep(cepLimpo);

        setAddress(prev => ({
          ...prev,
          street: endereco.logradouro,
          neighborhood: endereco.bairro,
          city: endereco.localidade,
          state: endereco.uf,
          postalCode
        }));
      } catch (error) {
        console.error('Erro na busca do CEP:', error);
        toast.error('CEP não encontrado');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    if (field === 'postalCode') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
      setAddress(prev => ({ ...prev, [field]: formattedValue }));
      handlePostalCodeChange(formattedValue);
    } else {
      setAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFinishPurchase = async (paymentData: PaymentData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        navigate('/auth');
        return;
      }

      if (!address.postalCode || !address.street || !address.city || !address.state || !address.number || !address.neighborhood) {
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
      } catch (error) {
        console.error('Erro ao salvar endereço:', error);
        toast.error('Erro ao salvar endereço. Por favor, tente novamente.');
        return;
      }

      if (!addressId) {
        toast.error('Erro ao processar endereço. Por favor, tente novamente.');
        return;
      }

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
        postalCode: '',
        number: '',
        neighborhood: '',
      });

    } catch (error: any) {
      console.error('Erro ao finalizar compra:', error);
      if (error.message === 'Token não fornecido') {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        navigate('/auth');
      } else {
        toast.error('Erro ao finalizar compra. Por favor, tente novamente.');
      }
    }
  };

  const handleOpenPaymentModal = async () => {
    const token = authService.getToken();
    if (!token || !isAuthenticated) {
      navigate('/auth');
      toast.error('Faça login para continuar');
      return;
    }

    if (!address.postalCode || !address.street || !address.city || !address.state || !address.number || !address.neighborhood) {
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Carrinho de Compras</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revise seus itens e complete sua compra
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de Produtos */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Endereço de Entrega</h3>
                  <AddressForm
                    address={address}
                    onChange={handleAddressChange}
                    loading={loadingCep}
                  />
                </div>
                <button
                  onClick={handleOpenPaymentModal}
                  className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        address={address}
        onPaymentComplete={handleFinishPurchase}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderId={orderId}
      />
    </div>
  );
};

export default Cart;