import React from 'react';
import styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy: React.FC = () => {
  const lastUpdate = '10 de abril de 2025';

  return (
    <div className={styles.privacyPolicy}>
      <div className={styles.container}>
        <div className={styles.fictionalNotice}>
          <p>
            ⚠️ ATENÇÃO: Esta é uma política de privacidade fictícia criada apenas para fins de demonstração. 
            Este documento não tem validade legal e é usado somente como exemplo em um projeto de desenvolvimento.
          </p>
        </div>

        <h1>Política de Privacidade</h1>
        <p className={styles.lastUpdate}>Última atualização: {lastUpdate}</p>

        <section>
          <h2>1. Informações que Coletamos</h2>
          <p>
            A GympPower coleta as seguintes informações pessoais para proporcionar
            uma melhor experiência de compra:
          </p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Endereço para entrega</li>
            <li>Informações de pagamento</li>
            <li>Histórico de compras</li>
            <li>Preferências de produtos</li>
          </ul>
        </section>

        <section>
          <h2>2. Como Utilizamos suas Informações</h2>
          <p>Suas informações são utilizadas para:</p>
          <ul>
            <li>Processar seus pedidos</li>
            <li>Enviar atualizações sobre seus pedidos</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Personalizar sua experiência de compra</li>
            <li>Enviar informações sobre promoções e novidades</li>
            <li>Prevenir fraudes</li>
          </ul>
        </section>

        <section>
          <h2>3. Proteção de Dados</h2>
          <p>
            Mantemos rígidos protocolos de segurança para proteger suas informações
            pessoais, incluindo:
          </p>
          <ul>
            <li>Criptografia SSL/TLS</li>
            <li>Acesso restrito a dados sensíveis</li>
            <li>Monitoramento constante de segurança</li>
            <li>Backups regulares</li>
            <li>Atualizações de segurança</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Suas informações podem ser compartilhadas apenas com:
          </p>
          <ul>
            <li>Processadores de pagamento</li>
            <li>Serviços de entrega</li>
            <li>Serviços de análise de dados</li>
            <li>Parceiros de marketing (com sua permissão)</li>
          </ul>
        </section>

        <section>
          <h2>5. Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimentos anteriores</li>
            <li>Receber seus dados em formato portável</li>
          </ul>
        </section>

        <section>
          <h2>6. Contato</h2>
          <p>
            Para questões relacionadas à privacidade de seus dados, entre em contato:
          </p>
          <div className={styles.contact}>
            <p>Email: privacidade@gympower.com</p>
            <p>Telefone: (11) 99999-9999</p>
            <p>Horário: Segunda a Sexta, das 9h às 18h</p>
          </div>
        </section>

        <section className={styles.disclaimer}>
          <p>
            Esta política de privacidade pode ser atualizada periodicamente.
            Recomendamos que você revise este documento regularmente.
          </p>
          <p className={styles.fictionalDisclaimer}>
            * Este documento é puramente fictício e foi criado para fins de demonstração do projeto GympPower.
            Não deve ser utilizado como base para políticas de privacidade reais.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;