import { type FluxoCaixaMes } from 'src/modules/financeiro/types/fluxo-caixa-mes';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { listarMeses } from 'src/modules/financeiro/utils/listar-meses.util';
import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

const arredondar = (valor: number): number => Math.round(valor * 100) / 100;

// Fluxo de caixa por mês entre `inicio` e `fim` (YYYY-MM). Cancelados são ignorados.
// `saldoInicial` permite começar o acumulado com o saldo de antes do período.
export const calcularFluxoCaixaMensal = (
  lancamentos: LancamentoResumo[],
  inicio: string,
  fim: string,
  saldoInicial = 0,
): FluxoCaixaMes[] => {
  const totaisPorMes = new Map<string, { entradas: number; saidas: number }>();

  for (const lancamento of lancamentos) {
    if (lancamento.status === 'CANCELADO') {
      continue;
    }

    const mes = mesDoLancamento(lancamento);

    if (!mes || mes < inicio || mes > fim) {
      continue;
    }

    const totais = totaisPorMes.get(mes) ?? { entradas: 0, saidas: 0 };

    if (lancamento.tipo === 'ENTRADA') {
      totais.entradas += lancamento.valor;
    } else {
      totais.saidas += lancamento.valor;
    }

    totaisPorMes.set(mes, totais);
  }

  let saldoAcumulado = saldoInicial;

  return listarMeses(inicio, fim).map((mes) => {
    const { entradas, saidas } = totaisPorMes.get(mes) ?? {
      entradas: 0,
      saidas: 0,
    };
    const saldo = entradas - saidas;

    saldoAcumulado += saldo;

    return {
      mes,
      entradas: arredondar(entradas),
      saidas: arredondar(saidas),
      saldo: arredondar(saldo),
      saldoAcumulado: arredondar(saldoAcumulado),
    };
  });
};
