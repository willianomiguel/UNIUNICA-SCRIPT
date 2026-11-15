import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';
import { microsParaReais } from 'src/modules/trafego/utils/micros-para-reais.util';

export const mapearNoVenda = (no: Record<string, unknown>): VendaResumo => {
  const valor = no.valor as { amountMicros?: number | string | null } | null;

  return {
    id: String(no.id),
    campanhaId: (no.campanhaId as string | null) ?? null,
    utmCampaign: (no.utmCampaign as string | null) ?? null,
    status: (no.status as string | null) ?? null,
    valor: microsParaReais(valor?.amountMicros),
  };
};
