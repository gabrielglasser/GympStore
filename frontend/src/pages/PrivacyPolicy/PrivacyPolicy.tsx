import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Saiba como tratamos e protegemos suas informações pessoais
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">
              Nota: Esta é uma política de privacidade fictícia criada apenas para fins de demonstração.
              Este documento não tem validade legal e é usado somente como exemplo em um projeto de
              desenvolvimento.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-600 mb-4">
                A GymPower coleta as seguintes informações pessoais para proporcionar uma melhor experiência de compra:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Endereço para entrega</li>
                <li>Informações de pagamento</li>
                <li>Histórico de compras</li>
                <li>Preferências de produtos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Como Utilizamos suas Informações</h2>
              <p className="text-gray-600 mb-4">
                Suas informações são utilizadas para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Processar seus pedidos</li>
                <li>Enviar atualizações sobre seus pedidos</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Personalizar sua experiência de compra</li>
                <li>Enviar informações sobre promoções e novidades</li>
                <li>Prevenir fraudes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Proteção de Dados</h2>
              <p className="text-gray-600">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição não autorizada.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;