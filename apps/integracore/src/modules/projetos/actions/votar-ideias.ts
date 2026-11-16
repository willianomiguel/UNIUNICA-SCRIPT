import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { type IdeiaRecord } from 'src/modules/projetos/types/ideia-record';
import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';
import { calcularPontuacaoIdeia } from 'src/modules/projetos/utils/calcular-pontuacao-ideia.util';
import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

// Soma 1 voto em cada ideia e já grava a nova pontuação.
// Usado pelo comando "Votar" e pela rota /s/projetos/ideias/votar.
export const votarIdeias = async (
  client: RestClientLike,
  ids: string[],
): Promise<BulkActionResult> => {
  const results: BulkActionResult['results'] = [];

  for (const id of ids) {
    try {
      const response = await client.get<{ data?: { ideia?: IdeiaRecord } }>(`/rest/ideias/${id}`);
      const ideia = response?.data?.ideia;

      if (!ideia) {
        results.push({ id, status: 'FAILED', message: 'Ideia não encontrada' });
        continue;
      }

      const votos = (ideia.votos ?? 0) + 1;

      await client.patch(`/rest/ideias/${id}`, {
        votos,
        pontuacao: calcularPontuacaoIdeia({ ...ideia, votos }),
      });
      results.push({ id, status: 'SUCCESS' });
    } catch (error) {
      results.push({
        id,
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  return summarizeBulkResults(results);
};
