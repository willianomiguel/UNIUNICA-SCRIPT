import { type IntervaloDatas } from 'src/modules/vendas/types/intervalo-datas';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';

type TotalDiario = {
  dia: string;
  faturamento: number;
  pagas: number;
  recusadas: number;
};

const chaveDoDia = (data: Date) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;

// One entry per local day in the interval (days without sales included), paid revenue only.
export const agruparVendasPorDia = (
  vendas: VendaParaMetricas[],
  intervalo: IntervaloDatas,
): TotalDiario[] => {
  const dias = new Map<string, TotalDiario>();
  const cursor = new Date(
    intervalo.inicio.getFullYear(),
    intervalo.inicio.getMonth(),
    intervalo.inicio.getDate(),
  );

  while (cursor.getTime() < intervalo.fim.getTime()) {
    const dia = chaveDoDia(cursor);

    dias.set(dia, { dia, faturamento: 0, pagas: 0, recusadas: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const venda of vendas) {
    if (venda.dataEvento === null) {
      continue;
    }

    const total = dias.get(chaveDoDia(new Date(venda.dataEvento)));

    if (total === undefined) {
      continue;
    }

    if (
      venda.status === 'APROVADA' ||
      venda.status === 'REEMBOLSADA' ||
      venda.status === 'CHARGEBACK'
    ) {
      total.pagas += 1;
      total.faturamento = Math.round((total.faturamento + venda.valor) * 100) / 100;
    } else if (venda.status === 'RECUSADA' || venda.status === 'FALHA') {
      total.recusadas += 1;
    }
  }

  return [...dias.values()];
};
