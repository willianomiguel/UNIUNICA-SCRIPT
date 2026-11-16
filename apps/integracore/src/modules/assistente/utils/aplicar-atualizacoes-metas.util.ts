import { type AtualizacaoMeta } from 'src/modules/metas/types/atualizacao-meta';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';

// Aplica o recálculo (valor, progresso, status) só em memória, sem gravar: a leitura do
// assistente mostra números frescos mesmo que o cron de metas ainda não tenha rodado.
export const aplicarAtualizacoesMetas = (
  metas: MetaResumo[],
  atualizacoes: AtualizacaoMeta[],
): MetaResumo[] => {
  const porId = new Map(atualizacoes.map((atualizacao) => [atualizacao.id, atualizacao]));

  return metas.map((meta) => {
    const atualizacao = porId.get(meta.id);

    if (!atualizacao) {
      return meta;
    }

    return {
      ...meta,
      valorAtual: atualizacao.valorAtual ?? meta.valorAtual,
      progresso: atualizacao.progresso,
      status: atualizacao.status,
    };
  });
};
