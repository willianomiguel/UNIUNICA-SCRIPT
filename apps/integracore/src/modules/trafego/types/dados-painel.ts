import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';

export type DadosPainel = {
  campanhas: CampanhaResumo[];
  metricas: LinhaMetrica[];
  vendas: VendaResumo[];
  // Mensagem quando as vendas não puderam ser lidas (ex.: módulo de vendas ainda não instalado).
  avisoVendas: string | null;
};
