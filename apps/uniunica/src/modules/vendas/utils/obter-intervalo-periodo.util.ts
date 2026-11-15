import { type IntervaloDatas } from 'src/modules/vendas/types/intervalo-datas';
import { type PeriodoPainel } from 'src/modules/vendas/types/periodo-painel';

const DIA_MS = 24 * 60 * 60 * 1000;

// Uses the runtime's local time zone for day/month boundaries; `fim` is always `agora`.
export const obterIntervaloPeriodo = (
  periodo: PeriodoPainel,
  agora: Date,
): IntervaloDatas => {
  const inicioDoDia = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
  );

  switch (periodo) {
    case 'HOJE':
      return { inicio: inicioDoDia, fim: agora };
    case '7D':
      return { inicio: new Date(inicioDoDia.getTime() - 6 * DIA_MS), fim: agora };
    case '30D':
      return { inicio: new Date(inicioDoDia.getTime() - 29 * DIA_MS), fim: agora };
    case 'MES':
      return {
        inicio: new Date(agora.getFullYear(), agora.getMonth(), 1),
        fim: agora,
      };
  }
};
