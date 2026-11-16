import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type ResumoVendas } from 'src/modules/assistente/types/resumo-vendas';
import { formatarPeriodo } from 'src/modules/assistente/utils/formatar-periodo.util';
import { intervaloIsoParaDatas } from 'src/modules/assistente/utils/intervalo-iso-para-datas.util';
import { obterIntervaloAnteriorIso } from 'src/modules/assistente/utils/obter-intervalo-anterior-iso.util';
import { formatarBrl } from 'src/modules/financeiro/utils/formatar-brl.util';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { agruparVendas } from 'src/modules/vendas/utils/agrupar-vendas.util';
import { calcularMetricasVendas } from 'src/modules/vendas/utils/calcular-metricas-vendas.util';
import { calcularVariacao } from 'src/modules/vendas/utils/calcular-variacao.util';
import { filtrarVendasPorIntervalo } from 'src/modules/vendas/utils/filtrar-vendas-por-intervalo.util';
import { formatarPercentual } from 'src/modules/vendas/utils/formatar-percentual.util';
import { obterIntervaloAnterior } from 'src/modules/vendas/utils/obter-intervalo-anterior.util';

const STATUS_PAGOS = ['APROVADA', 'REEMBOLSADA', 'CHARGEBACK'];

const formatarVariacao = (variacao: number | null): string =>
  variacao === null ? 'sem base de comparação' : `${variacao >= 0 ? '+' : ''}${formatarPercentual(variacao)}`;

// Resumo de vendas do período e comparação com o período anterior de mesma duração (função pura).
// `vendas` deve cobrir os dois períodos.
export const montarResumoVendas = ({
  vendas,
  intervalo,
}: {
  vendas: VendaParaMetricas[];
  intervalo: IntervaloIso;
}): ResumoVendas => {
  const datasAtual = intervaloIsoParaDatas(intervalo);
  const atuais = filtrarVendasPorIntervalo(vendas, datasAtual);
  const anteriores = filtrarVendasPorIntervalo(vendas, obterIntervaloAnterior(datasAtual));
  const metricas = calcularMetricasVendas(atuais);
  const metricasAnteriores = calcularMetricasVendas(anteriores);
  const intervaloAnterior = obterIntervaloAnteriorIso(intervalo);
  const quantidadeAprovadas = atuais.filter((venda) => venda.status === 'APROVADA').length;
  const porGateway = agruparVendas(
    atuais.filter((venda) => venda.status !== null && STATUS_PAGOS.includes(venda.status)),
    'gateway',
  );
  const variacaoFaturamentoBruto = calcularVariacao(metricas.faturamentoBruto, metricasAnteriores.faturamentoBruto);
  const variacaoFaturamentoLiquido = calcularVariacao(metricas.faturamentoLiquido, metricasAnteriores.faturamentoLiquido);
  const variacaoQuantidade = calcularVariacao(metricas.quantidadePagas, metricasAnteriores.quantidadePagas);

  const linhas = [
    `Vendas de ${formatarPeriodo(intervalo)}: faturamento bruto ${formatarBrl(metricas.faturamentoBruto)}, líquido ${formatarBrl(metricas.faturamentoLiquido)}.`,
    `- ${quantidadeAprovadas} venda(s) aprovada(s), ${metricas.quantidadePagas} paga(s) no total; ticket médio ${formatarBrl(metricas.ticketMedio)}.`,
    `- Reembolsos: ${metricas.quantidadeReembolsadas} (${formatarBrl(metricas.valorReembolsado)}); chargebacks: ${metricas.quantidadeChargebacks} (${formatarBrl(metricas.valorChargeback)}).`,
    `- Contra ${formatarPeriodo(intervaloAnterior)} (${formatarBrl(metricasAnteriores.faturamentoBruto)} bruto): faturamento ${formatarVariacao(variacaoFaturamentoBruto)}, quantidade ${formatarVariacao(variacaoQuantidade)}.`,
  ];

  if (porGateway.length > 0) {
    linhas.push(`- Por gateway: ${porGateway.map((item) => `${item.chave} ${formatarBrl(item.valor)} (${item.quantidade})`).join('; ')}.`);
  }

  return {
    inicio: intervalo.inicio,
    fim: intervalo.fim,
    faturamentoBruto: metricas.faturamentoBruto,
    faturamentoLiquido: metricas.faturamentoLiquido,
    quantidadeAprovadas,
    quantidadePagas: metricas.quantidadePagas,
    ticketMedio: metricas.ticketMedio,
    quantidadeReembolsos: metricas.quantidadeReembolsadas,
    valorReembolsado: metricas.valorReembolsado,
    quantidadeChargebacks: metricas.quantidadeChargebacks,
    valorChargeback: metricas.valorChargeback,
    porGateway,
    anterior: {
      inicio: intervaloAnterior.inicio,
      fim: intervaloAnterior.fim,
      faturamentoBruto: metricasAnteriores.faturamentoBruto,
      faturamentoLiquido: metricasAnteriores.faturamentoLiquido,
      quantidadePagas: metricasAnteriores.quantidadePagas,
    },
    variacaoFaturamentoBruto,
    variacaoFaturamentoLiquido,
    variacaoQuantidade,
    mensagem: linhas.join('\n'),
  };
};
