import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type IntervaloDatas } from 'src/modules/vendas/types/intervalo-datas';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

// Horário de Brasília (sem horário de verão desde 2019). Início inclusivo, fim exclusivo
// (meia-noite do dia seguinte ao fim), como espera filtrarVendasPorIntervalo.
export const intervaloIsoParaDatas = (intervalo: IntervaloIso): IntervaloDatas => ({
  inicio: new Date(`${intervalo.inicio}T00:00:00-03:00`),
  fim: new Date(`${somarDias(intervalo.fim, 1)}T00:00:00-03:00`),
});
