import { type SituacaoMeta } from 'src/modules/assistente/types/situacao-meta';
import { aplicarAtualizacoesMetas } from 'src/modules/assistente/utils/aplicar-atualizacoes-metas.util';
import { montarSituacaoMetas } from 'src/modules/assistente/utils/montar-situacao-metas.util';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { carregarDadosFontes } from 'src/modules/metas/utils/carregar-dados-fontes.util';
import { normalizarMeta } from 'src/modules/metas/utils/normalizar-meta.util';
import { recalcularMetas } from 'src/modules/metas/utils/recalcular-metas.util';

// Lê as metas, recalcula em memória (sem gravar) e monta a situação de cada uma.
export const obterSituacaoMetas = async (
  cliente: ClienteRest,
  hoje: string,
  filtros: { status: string | null; busca: string | null },
): Promise<{ metas: SituacaoMeta[]; mensagem: string }> => {
  const metas = (await listarRegistros(cliente, 'metas')).map(normalizarMeta);
  const dados = await carregarDadosFontes(
    cliente,
    metas.map((meta) => meta.fonte),
  );
  const atualizadas = aplicarAtualizacoesMetas(metas, recalcularMetas(metas, dados, hoje));

  return montarSituacaoMetas({ metas: atualizadas, hoje, ...filtros });
};
