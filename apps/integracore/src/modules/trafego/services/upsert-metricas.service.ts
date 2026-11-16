import { executarGraphql } from 'src/modules/trafego/services/executar-graphql.service';
import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { resolverCampanhas } from 'src/modules/trafego/services/resolver-campanhas.service';
import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';
import { dividirEmLotes } from 'src/modules/trafego/utils/dividir-em-lotes.util';
import { mapearMetricaParaRegistro } from 'src/modules/trafego/utils/mapear-metrica-para-registro.util';

const ATUALIZAR = `mutation AtualizarMetrica($id: UUID!, $data: MetricaTrafegoUpdateInput!) {
  updateMetricaTrafego(id: $id, data: $data) { id }
}`;

const CRIAR_LOTE = `mutation CriarMetricas($data: [MetricaTrafegoCreateInput!]!) {
  createMetricasTrafego(data: $data) { id }
}`;

// Grava as métricas: atualiza a linha de mesma `chave` ou cria uma nova (idempotente).
export const upsertMetricas = async (
  metricas: MetricaNormalizada[],
  { criarCampanhas }: { criarCampanhas: boolean },
): Promise<{ criadas: number; atualizadas: number; campanhasCriadas: number }> => {
  if (metricas.length === 0) {
    return { criadas: 0, atualizadas: 0, campanhasCriadas: 0 };
  }

  const { porChave: campanhaPorChave, criadas: campanhasCriadas } =
    await resolverCampanhas(metricas, { criarSeFaltar: criarCampanhas });

  const idPorChave = new Map<string, string>();

  for (const lote of dividirEmLotes(metricas.map((metrica) => metrica.chave), 100)) {
    const existentes = await listarTodos({
      plural: 'metricasTrafego',
      tipoFiltro: 'MetricaTrafegoFilterInput',
      campos: 'id chave',
      filtro: { chave: { in: lote } },
    });

    for (const existente of existentes) {
      idPorChave.set(existente.chave, existente.id);
    }
  }

  const novas: Record<string, unknown>[] = [];
  const atualizacoes: Array<{ id: string; data: Record<string, unknown> }> = [];

  for (const metrica of metricas) {
    const dados = mapearMetricaParaRegistro(metrica, campanhaPorChave.get(metrica.chave) ?? null);
    const id = idPorChave.get(metrica.chave);

    if (id) {
      atualizacoes.push({ id, data: dados });
    } else {
      novas.push(dados);
    }
  }

  for (const lote of dividirEmLotes(atualizacoes, 10)) {
    await Promise.all(lote.map((item) => executarGraphql(ATUALIZAR, item)));
  }

  for (const lote of dividirEmLotes(novas, 50)) {
    await executarGraphql(CRIAR_LOTE, { data: lote });
  }

  return { criadas: novas.length, atualizadas: atualizacoes.length, campanhasCriadas };
};
