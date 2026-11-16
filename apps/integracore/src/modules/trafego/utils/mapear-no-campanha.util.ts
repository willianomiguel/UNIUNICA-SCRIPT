import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';

export const mapearNoCampanha = (no: Record<string, unknown>): CampanhaResumo => ({
  id: String(no.id),
  nome: (no.nome as string | null) ?? null,
  plataforma: (no.plataforma as string | null) ?? null,
  status: (no.status as string | null) ?? null,
  utmCampaign: (no.utmCampaign as string | null) ?? null,
  idExterno: (no.idExterno as string | null) ?? null,
});
