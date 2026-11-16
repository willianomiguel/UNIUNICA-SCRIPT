import { criarCampanha } from 'src/modules/trafego/services/criar-campanha.service';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';
import { encontrarCampanhaPorReferencia } from 'src/modules/trafego/utils/encontrar-campanha-por-referencia.util';
import { plataformaDaOrigem } from 'src/modules/trafego/utils/plataforma-da-origem.util';

// Liga cada métrica a uma campanha; cria a campanha quando vier idExterno ou nome desconhecido.
export const resolverCampanhas = async (
  metricas: MetricaNormalizada[],
  { criarSeFaltar }: { criarSeFaltar: boolean },
): Promise<{ porChave: Map<string, CampanhaResumo | null>; criadas: number }> => {
  const campanhas = await listarCampanhas();
  const porChave = new Map<string, CampanhaResumo | null>();
  let criadas = 0;

  for (const metrica of metricas) {
    let campanha = encontrarCampanhaPorReferencia(campanhas, metrica.campanha);
    const referencia = metrica.campanha;

    if (!campanha && criarSeFaltar && (referencia?.idExterno || referencia?.nome)) {
      campanha = await criarCampanha({
        nome: referencia.nome ?? `Campanha ${referencia.idExterno}`,
        plataforma: plataformaDaOrigem(metrica.origem),
        status: 'ATIVA',
        idExterno: referencia.idExterno ?? null,
        utmCampaign: referencia.utmCampaign ?? null,
      });
      campanhas.push(campanha);
      criadas += 1;
    }

    porChave.set(metrica.chave, campanha);
  }

  return { porChave, criadas };
};
