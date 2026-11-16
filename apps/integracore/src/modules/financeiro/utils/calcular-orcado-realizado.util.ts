import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { type OrcadoRealizadoLinha } from 'src/modules/financeiro/types/orcado-realizado-linha';
import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

const arredondar = (valor: number): number => Math.round(valor * 100) / 100;

// Orçado x realizado por categoria no mês YYYY-MM. Considera apenas lançamentos
// do mesmo tipo da categoria e ignora cancelados.
export const calcularOrcadoRealizado = (
  categorias: CategoriaResumo[],
  lancamentos: LancamentoResumo[],
  mes: string,
): OrcadoRealizadoLinha[] => {
  const realizadoPorCategoria = new Map<string, number>();
  const tipoPorCategoria = new Map(
    categorias.map((categoria) => [categoria.id, categoria.tipo]),
  );

  for (const lancamento of lancamentos) {
    if (
      !lancamento.categoriaId ||
      lancamento.status === 'CANCELADO' ||
      mesDoLancamento(lancamento) !== mes ||
      tipoPorCategoria.get(lancamento.categoriaId) !== lancamento.tipo
    ) {
      continue;
    }

    realizadoPorCategoria.set(
      lancamento.categoriaId,
      (realizadoPorCategoria.get(lancamento.categoriaId) ?? 0) + lancamento.valor,
    );
  }

  return categorias
    .map((categoria) => {
      const realizado = arredondar(realizadoPorCategoria.get(categoria.id) ?? 0);
      const orcado = arredondar(categoria.orcamentoMensal);

      return {
        categoriaId: categoria.id,
        nome: categoria.nome,
        tipo: categoria.tipo,
        orcado,
        realizado,
        diferenca: arredondar(orcado - realizado),
        percentual: orcado > 0 ? arredondar((realizado / orcado) * 100) : null,
      };
    })
    .sort((a, b) =>
      a.tipo === b.tipo ? b.orcado - a.orcado : a.tipo === 'ENTRADA' ? -1 : 1,
    );
};
