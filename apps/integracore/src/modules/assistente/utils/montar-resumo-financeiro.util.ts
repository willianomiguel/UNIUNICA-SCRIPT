import { LIMITES_ASSISTENTE } from 'src/modules/assistente/constants/assistente-limites';
import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type ResumoFinanceiro } from 'src/modules/assistente/types/resumo-financeiro';
import { formatarPeriodo } from 'src/modules/assistente/utils/formatar-periodo.util';
import { reaisParaCentavos } from 'src/modules/assistente/utils/reais-para-centavos.util';
import { somarDrePorMeses } from 'src/modules/assistente/utils/somar-dre-por-meses.util';
import { type DadosFinanceiros } from 'src/modules/financeiro/types/dados-financeiros';
import { calcularEmAberto } from 'src/modules/financeiro/utils/calcular-em-aberto.util';
import { estaAtrasado } from 'src/modules/financeiro/utils/esta-atrasado.util';
import { formatarBrl } from 'src/modules/financeiro/utils/formatar-brl.util';

// Monta o resumo financeiro do período a partir de dados já carregados (função pura).
export const montarResumoFinanceiro = ({
  dados,
  intervalo,
  hoje,
}: {
  dados: DadosFinanceiros;
  intervalo: IntervaloIso;
  hoje: string;
}): ResumoFinanceiro => {
  const { lancamentos, categorias } = dados;

  const noPeriodo = lancamentos.filter((lancamento) => {
    const referencia = (lancamento.data ?? lancamento.vencimento)?.slice(0, 10);

    return (
      lancamento.status !== 'CANCELADO' &&
      referencia !== undefined &&
      referencia >= intervalo.inicio &&
      referencia <= intervalo.fim
    );
  });

  const previsto = somarDrePorMeses(noPeriodo, categorias);
  const realizado = somarDrePorMeses(
    noPeriodo.filter((lancamento) => lancamento.status === 'PAGO'),
    categorias,
  );
  const emAberto = calcularEmAberto(lancamentos);

  let atrasadosAPagarCentavos = 0;
  let atrasadosAReceberCentavos = 0;
  let atrasadosQuantidade = 0;

  for (const lancamento of lancamentos) {
    if (lancamento.status !== 'ATRASADO' && !estaAtrasado(lancamento, hoje)) {
      continue;
    }

    atrasadosQuantidade += 1;

    if (lancamento.tipo === 'ENTRADA') {
      atrasadosAReceberCentavos += reaisParaCentavos(lancamento.valor);
    } else {
      atrasadosAPagarCentavos += reaisParaCentavos(lancamento.valor);
    }
  }

  const saldoRealizado = (reaisParaCentavos(realizado.receita) - reaisParaCentavos(realizado.custos)) / 100;
  const saldoPrevisto = (reaisParaCentavos(previsto.receita) - reaisParaCentavos(previsto.custos)) / 100;
  const atrasadosAPagar = atrasadosAPagarCentavos / 100;
  const atrasadosAReceber = atrasadosAReceberCentavos / 100;
  const atrasadosValor = (atrasadosAPagarCentavos + atrasadosAReceberCentavos) / 100;
  const topCategoriasDespesa = previsto.custosPorCategoria.slice(0, LIMITES_ASSISTENTE.topCategorias);

  const linhas = [
    `Financeiro de ${formatarPeriodo(intervalo)} (${noPeriodo.length} lançamentos, sem cancelados):`,
    `- Realizado (pago): receitas ${formatarBrl(realizado.receita)}, despesas ${formatarBrl(realizado.custos)}, saldo ${formatarBrl(saldoRealizado)}.`,
    `- Previsto (pago + pendente + atrasado): receitas ${formatarBrl(previsto.receita)}, despesas ${formatarBrl(previsto.custos)}, saldo ${formatarBrl(saldoPrevisto)}.`,
    `- Em aberto hoje: a receber ${formatarBrl(emAberto.aReceber)}, a pagar ${formatarBrl(emAberto.aPagar)}.`,
    atrasadosQuantidade === 0
      ? '- Nenhum lançamento atrasado.'
      : `- Atrasados: ${atrasadosQuantidade} no total de ${formatarBrl(atrasadosValor)} (a pagar ${formatarBrl(atrasadosAPagar)}, a receber ${formatarBrl(atrasadosAReceber)}).`,
  ];

  if (topCategoriasDespesa.length > 0) {
    linhas.push(
      `- Maiores categorias de despesa: ${topCategoriasDespesa.map((linha) => `${linha.nome} ${formatarBrl(linha.valor)}`).join('; ')}.`,
    );
  }

  return {
    inicio: intervalo.inicio,
    fim: intervalo.fim,
    receitasRealizadas: realizado.receita,
    despesasRealizadas: realizado.custos,
    saldoRealizado,
    receitasPrevistas: previsto.receita,
    despesasPrevistas: previsto.custos,
    saldoPrevisto,
    aReceberEmAberto: emAberto.aReceber,
    aPagarEmAberto: emAberto.aPagar,
    atrasadosQuantidade,
    atrasadosValor,
    atrasadosAPagar,
    atrasadosAReceber,
    topCategoriasDespesa,
    quantidadeLancamentosNoPeriodo: noPeriodo.length,
    mensagem: linhas.join('\n'),
  };
};
