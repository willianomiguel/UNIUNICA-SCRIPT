import { type TotalAgrupado } from 'src/modules/vendas/types/total-agrupado';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';

type ChaveAgrupamento = 'status' | 'gateway' | 'metodoPagamento';

// Records without a value for the key are grouped under 'SEM_VALOR'. Sorted by amount, descending.
export const agruparVendas = (
  vendas: VendaParaMetricas[],
  chave: ChaveAgrupamento,
): TotalAgrupado<string>[] => {
  const totais = new Map<string, TotalAgrupado<string>>();

  for (const venda of vendas) {
    const valorChave = venda[chave] ?? 'SEM_VALOR';
    const atual = totais.get(valorChave) ?? {
      chave: valorChave,
      quantidade: 0,
      valor: 0,
    };

    atual.quantidade += 1;
    atual.valor = Math.round((atual.valor + venda.valor) * 100) / 100;
    totais.set(valorChave, atual);
  }

  return [...totais.values()].sort(
    (a, b) => b.valor - a.valor || b.quantidade - a.quantidade,
  );
};
