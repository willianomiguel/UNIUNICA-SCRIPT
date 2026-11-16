import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { carregarDadosFontes } from 'src/modules/metas/utils/carregar-dados-fontes.util';
import { normalizarMeta } from 'src/modules/metas/utils/normalizar-meta.util';
import { recalcularMetas } from 'src/modules/metas/utils/recalcular-metas.util';

// Lê metas e fontes, recalcula e grava só o que mudou. Idempotente.
export const aplicarRecalculoMetas = async (
  cliente: ClienteRest,
  hoje: string,
  agoraIso: string = new Date().toISOString(),
): Promise<{ metas: number; atualizadas: number }> => {
  const metas = (await listarRegistros(cliente, 'metas')).map(normalizarMeta);
  const dados = await carregarDadosFontes(
    cliente,
    metas.map((meta) => meta.fonte),
  );
  const atualizacoes = recalcularMetas(metas, dados, hoje);

  for (const { id, ...campos } of atualizacoes) {
    await cliente.patch(`/rest/metas/${id}`, {
      ...campos,
      ultimaAtualizacao: agoraIso,
    });
  }

  return { metas: metas.length, atualizadas: atualizacoes.length };
};
