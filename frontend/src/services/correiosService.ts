/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface CepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface FreteResponse {
  Valor: string;
  PrazoEntrega: string;
}

export const correiosService = {
  // Buscar endereço por CEP usando a API ViaCEP
  consultarCep: async (cep: string): Promise<CepResponse> => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return response.data;
    } catch (error) {
      throw new Error('Erro ao consultar CEP');
    }
  },

  // Calcular frete usando a API dos Correios
  calcularFrete: async (cep: string, peso: number): Promise<FreteResponse> => {
    try {
      console.log('Iniciando cálculo do frete:', { cep, peso });

      const params = new URLSearchParams({
        nCdServico: '04014', 
        sCepOrigem: '01310000',
        sCepDestino: cep,
        nVlPeso: peso.toString(),
        nCdFormato: '1',
        nVlComprimento: '20',
        nVlAltura: '20',
        nVlLargura: '20',
        nVlDiametro: '0',
        sCdMaoPropria: 'N',
        nVlValorDeclarado: '0',
        sCdAvisoRecebimento: 'N'
      });

      const url = `https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${params.toString()}`;

      console.log('Fazendo requisição para:', url);

      const response = await axios.get(url, {
        timeout: 10000, 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/xml'
        }
      });

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        parseTagValue: true
      });
      
      const result = parser.parse(response.data);
      console.log('Resposta parseada:', result);

      const servico = result?.Servicos?.cServico?.[0] || result?.Servicos?.cServico;

      if (!servico || servico.Erro !== '0') {
        throw new Error(servico?.MsgErro || 'Erro ao calcular frete');
      }

      return {
        Valor: servico.Valor.replace(',', '.'),
        PrazoEntrega: servico.PrazoEntrega
      };

    } catch (error: any) {
      console.error('Erro detalhado:', {
        error,
        message: error.message,
        response: error?.response?.data
      });
      
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Tempo limite excedido. Por favor, tente novamente.');
      }
      
      throw error;
    }
  }
};