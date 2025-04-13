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
      return response.data;
    } catch (error) {
      throw new Error('Erro ao consultar CEP');
    }
  },

  // Calcular frete usando a API dos Correios
  calcularFrete: async (cep: string, peso: number): Promise<FreteResponse> => {
    try {
      const params = {
        nCdServico: '04014',  // SEDEX
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
        sCdAvisoRecebimento: 'N',
        StrRetorno: 'xml',
        nIndicaCalculo: '3'
      };

      const response = await axios.get(
        'https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx',
        { 
          params,
          timeout: 10000, 
          headers: {
            'Content-Type': 'application/xml; charset=utf-8'
          }
        }
      );

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ''
      });
      
      const result = parser.parse(response.data);
      const servico = result.Servicos.cServico[0] || result.Servicos.cServico;

      if (servico.Erro && servico.Erro !== '0') {
        throw new Error(servico.MsgErro || 'Erro ao calcular frete');
      }

      return {
        Valor: servico.Valor,
        PrazoEntrega: servico.PrazoEntrega
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Tempo limite excedido ao calcular o frete');
      }
      throw error;
    }
  }
};