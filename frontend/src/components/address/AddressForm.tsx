import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Address } from '../../types';
import styles from './AddressForm.module.scss';
import { correiosService } from '../../services/correiosService';
import { toast } from 'react-toastify';

interface AddressFormProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  loading?: boolean;
}

export function AddressForm({ address, onChange, loading = false }: AddressFormProps) {
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let zipCode = e.target.value.replace(/\D/g, '');
    zipCode = zipCode.replace(/(\d{5})(\d)/, '$1-$2');
    onChange('postalCode', zipCode);

    if (zipCode.length === 9) { // Formato: 00000-000
      try {
        const cepLimpo = zipCode.replace(/\D/g, '');
        const endereco = await correiosService.consultarCep(cepLimpo);

        onChange('street', endereco.logradouro);
        onChange('neighborhood', endereco.bairro);
        onChange('city', endereco.localidade);
        onChange('state', endereco.uf);
      } catch (error) {
        console.error('Erro na busca do CEP:', error);
        toast.error('CEP não encontrado');
      }
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="postalCode">CEP</label>
          <div className={styles.inputWithIcon}>
            <input
              id="postalCode"
              type="text"
              value={address.postalCode}
              onChange={handlePostalCodeChange}
              placeholder="00000-000"
              maxLength={9}
            />
            {loading && (
              <div className={styles.loader}>
                <Loader className={styles.spinIcon} size={16} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="street">Rua</label>
          <input
            id="street"
            type="text"
            value={address.street}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="Nome da rua"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="number">Número</label>
          <input
            id="number"
            type="text"
            value={address.number}
            onChange={(e) => onChange('number', e.target.value)}
            placeholder="123"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="complement">Complemento</label>
          <input
            id="complement"
            type="text"
            value={address.complement || ''}
            onChange={(e) => onChange('complement', e.target.value)}
            placeholder="Apto, Bloco, etc. (opcional)"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="neighborhood">Bairro</label>
          <input
            id="neighborhood"
            type="text"
            value={address.neighborhood}
            onChange={(e) => onChange('neighborhood', e.target.value)}
            placeholder="Nome do bairro"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="city">Cidade</label>
          <input
            id="city"
            type="text"
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Nome da cidade"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="state">Estado</label>
          <input
            id="state"
            type="text"
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="UF"
            maxLength={2}
          />
        </div>
      </div>
    </div>
  );
} 