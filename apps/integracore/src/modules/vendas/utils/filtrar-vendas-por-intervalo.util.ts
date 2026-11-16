import { type IntervaloDatas } from 'src/modules/vendas/types/intervalo-datas';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';

// Start inclusive, end exclusive. Sales without a date are left out.
export const filtrarVendasPorIntervalo = (
  vendas: VendaParaMetricas[],
  intervalo: IntervaloDatas,
): VendaParaMetricas[] => {
  const inicio = intervalo.inicio.getTime();
  const fim = intervalo.fim.getTime();

  return vendas.filter((venda) => {
    if (venda.dataEvento === null) {
      return false;
    }

    const data = new Date(venda.dataEvento).getTime();

    return !Number.isNaN(data) && data >= inicio && data < fim;
  });
};
