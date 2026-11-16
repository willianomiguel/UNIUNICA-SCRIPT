import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { type IdeiaRecord } from 'src/modules/projetos/types/ideia-record';
import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';
import { buildProjetoFromIdeia } from 'src/modules/projetos/utils/build-projeto-from-ideia.util';
import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

// Cria um projeto por ideia, liga a ideia ao projeto e marca VIROU_PROJETO.
// Ideias já ligadas a um projeto são ignoradas (idempotente).
export const transformarIdeiasEmProjeto = async (
  client: RestClientLike,
  ids: string[],
  todayMs: number,
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

      if (ideia.projetoId) {
        results.push({
          id,
          status: 'SKIPPED',
          projetoId: ideia.projetoId,
          message: `"${ideia.titulo ?? 'Ideia'}" já virou projeto`,
        });
        continue;
      }

      const created = await client.post<{ data?: { createProjeto?: { id: string } } }>(
        '/rest/projetos',
        buildProjetoFromIdeia(ideia, todayMs),
      );
      const projetoId = created?.data?.createProjeto?.id;

      if (!projetoId) {
        results.push({ id, status: 'FAILED', message: 'O projeto não foi criado' });
        continue;
      }

      await client.patch(`/rest/ideias/${id}`, { projetoId, status: 'VIROU_PROJETO' });
      results.push({ id, status: 'SUCCESS', projetoId });
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
