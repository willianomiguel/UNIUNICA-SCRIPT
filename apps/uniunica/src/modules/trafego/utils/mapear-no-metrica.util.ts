import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { microsParaReais } from 'src/modules/trafego/utils/micros-para-reais.util';

export const mapearNoMetrica = (no: Record<string, unknown>): LinhaMetrica => {
  const gasto = no.gasto as { amountMicros?: number | string | null } | null;

  return {
    data: (no.data as string | null) ?? null,
    campanhaId: (no.campanhaId as string | null) ?? null,
    origem: (no.origem as string | null) ?? null,
    impressoes: Number(no.impressoes) || 0,
    cliques: Number(no.cliques) || 0,
    visitas: Number(no.visitas) || 0,
    leads: Number(no.leads) || 0,
    conversoes: Number(no.conversoes) || 0,
    gasto: microsParaReais(gasto?.amountMicros),
  };
};
