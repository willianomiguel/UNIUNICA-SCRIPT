import { reaisParaCentavos } from 'src/modules/assistente/utils/reais-para-centavos.util';
import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { type LinhaValor } from 'src/modules/financeiro/types/linha-valor';
import { calcularDreSimplificada } from 'src/modules/financeiro/utils/calcular-dre-simplificada.util';
import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

// Aplica a DRE simplificada do painel a cada mês presente nos lançamentos e soma tudo
// (em centavos inteiros). Cancelados já ficam de fora da DRE.
export const somarDrePorMeses = (
  lancamentos: LancamentoResumo[],
  categorias: CategoriaResumo[],
): { receita: number; custos: number; custosPorCategoria: LinhaValor[] } => {
  const meses = new Set<string>();

  for (const lancamento of lancamentos) {
    const mes = mesDoLancamento(lancamento);

    if (mes) {
      meses.add(mes);
    }
  }

  let receitaCentavos = 0;
  let custosCentavos = 0;
  const porCategoria = new Map<string, { nome: string; centavos: number }>();

  for (const mes of meses) {
    const dre = calcularDreSimplificada(lancamentos, categorias, mes);

    receitaCentavos += reaisParaCentavos(dre.receita);
    custosCentavos += reaisParaCentavos(dre.custos);

    for (const linha of dre.custosPorCategoria) {
      const atual = porCategoria.get(linha.chave) ?? { nome: linha.nome, centavos: 0 };

      atual.centavos += reaisParaCentavos(linha.valor);
      porCategoria.set(linha.chave, atual);
    }
  }

  const custosPorCategoria = [...porCategoria.entries()]
    .map(([chave, { nome, centavos }]) => ({ chave, nome, valor: centavos / 100 }))
    .sort((a, b) => b.valor - a.valor);

  return { receita: receitaCentavos / 100, custos: custosCentavos / 100, custosPorCategoria };
};
