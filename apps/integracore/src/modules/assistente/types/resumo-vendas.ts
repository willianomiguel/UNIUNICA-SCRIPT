import { type PeriodoComparado } from 'src/modules/assistente/types/periodo-comparado';
import { type TotalAgrupado } from 'src/modules/vendas/types/total-agrupado';

export type ResumoVendas = {
  inicio: string;
  fim: string;
  faturamentoBruto: number;
  faturamentoLiquido: number;
  quantidadeAprovadas: number;
  quantidadePagas: number;
  ticketMedio: number;
  quantidadeReembolsos: number;
  valorReembolsado: number;
  quantidadeChargebacks: number;
  valorChargeback: number;
  porGateway: TotalAgrupado<string>[];
  anterior: PeriodoComparado;
  // Variação em fração (0,1 = +10%); null quando o período anterior é zero.
  variacaoFaturamentoBruto: number | null;
  variacaoFaturamentoLiquido: number | null;
  variacaoQuantidade: number | null;
  mensagem: string;
};
