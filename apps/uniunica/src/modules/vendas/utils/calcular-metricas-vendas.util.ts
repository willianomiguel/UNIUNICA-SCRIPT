import { type MetricasVendas } from 'src/modules/vendas/types/metricas-vendas';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

// A sale counts as paid when the money was captured, even if it later left (refund/chargeback).
const STATUS_PAGOS: VendaStatus[] = ['APROVADA', 'REEMBOLSADA', 'CHARGEBACK'];
const STATUS_RECUSADOS: VendaStatus[] = ['RECUSADA', 'FALHA'];

const dividir = (numerador: number, denominador: number) =>
  denominador > 0 ? numerador / denominador : 0;

const arredondar = (valor: number) => Math.round(valor * 100) / 100;

export const calcularMetricasVendas = (
  vendas: VendaParaMetricas[],
): MetricasVendas => {
  let quantidadePagas = 0;
  let quantidadePendentes = 0;
  let quantidadeRecusadas = 0;
  let quantidadeReembolsadas = 0;
  let quantidadeChargebacks = 0;
  let faturamentoBruto = 0;
  let faturamentoLiquido = 0;
  let totalTaxas = 0;
  let valorReembolsado = 0;
  let valorChargeback = 0;
  let valorPendente = 0;
  let valorRecusado = 0;

  for (const venda of vendas) {
    const status = venda.status;

    if (status === null) {
      continue;
    }

    if (STATUS_PAGOS.includes(status)) {
      quantidadePagas += 1;
      faturamentoBruto += venda.valor;
      totalTaxas += venda.taxaGateway ?? 0;
    }

    if (status === 'APROVADA') {
      faturamentoLiquido +=
        venda.valorLiquido ?? venda.valor - (venda.taxaGateway ?? 0);
    } else if (status === 'REEMBOLSADA') {
      quantidadeReembolsadas += 1;
      valorReembolsado += venda.valor;
    } else if (status === 'CHARGEBACK') {
      quantidadeChargebacks += 1;
      valorChargeback += venda.valor;
    } else if (status === 'PENDENTE') {
      quantidadePendentes += 1;
      valorPendente += venda.valor;
    } else if (STATUS_RECUSADOS.includes(status)) {
      quantidadeRecusadas += 1;
      valorRecusado += venda.valor;
    }
  }

  const tentativasDecididas = quantidadePagas + quantidadeRecusadas;

  return {
    totalRegistros: vendas.length,
    quantidadePagas,
    quantidadePendentes,
    quantidadeRecusadas,
    quantidadeReembolsadas,
    quantidadeChargebacks,
    faturamentoBruto: arredondar(faturamentoBruto),
    faturamentoLiquido: arredondar(faturamentoLiquido),
    totalTaxas: arredondar(totalTaxas),
    valorReembolsado: arredondar(valorReembolsado),
    valorChargeback: arredondar(valorChargeback),
    valorPendente: arredondar(valorPendente),
    valorRecusado: arredondar(valorRecusado),
    ticketMedio: arredondar(dividir(faturamentoBruto, quantidadePagas)),
    taxaAprovacao: dividir(quantidadePagas, tentativasDecididas),
    taxaRecusa: dividir(quantidadeRecusadas, tentativasDecididas),
    percentualChargeback: dividir(quantidadeChargebacks, quantidadePagas),
    percentualReembolso: dividir(quantidadeReembolsadas, quantidadePagas),
  };
};
