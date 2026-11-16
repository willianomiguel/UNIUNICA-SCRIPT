import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

// Total ainda não pago (pendente ou atrasado), separado em a receber e a pagar.
// Independe do mês: é tudo que está em aberto hoje.
export const calcularEmAberto = (
  lancamentos: LancamentoResumo[],
): { aReceber: number; aPagar: number } => {
  let aReceberCentavos = 0;
  let aPagarCentavos = 0;

  for (const lancamento of lancamentos) {
    if (lancamento.status !== 'PENDENTE' && lancamento.status !== 'ATRASADO') {
      continue;
    }

    const centavos = Math.round(lancamento.valor * 100);

    if (lancamento.tipo === 'ENTRADA') {
      aReceberCentavos += centavos;
    } else {
      aPagarCentavos += centavos;
    }
  }

  return { aReceber: aReceberCentavos / 100, aPagar: aPagarCentavos / 100 };
};
