// Amounts in reais, rates as fractions between 0 and 1.
export type MetricasVendas = {
  totalRegistros: number;
  quantidadePagas: number;
  quantidadePendentes: number;
  quantidadeRecusadas: number;
  quantidadeReembolsadas: number;
  quantidadeChargebacks: number;
  faturamentoBruto: number;
  faturamentoLiquido: number;
  totalTaxas: number;
  valorReembolsado: number;
  valorChargeback: number;
  valorPendente: number;
  valorRecusado: number;
  ticketMedio: number;
  taxaAprovacao: number;
  taxaRecusa: number;
  percentualChargeback: number;
  percentualReembolso: number;
};
