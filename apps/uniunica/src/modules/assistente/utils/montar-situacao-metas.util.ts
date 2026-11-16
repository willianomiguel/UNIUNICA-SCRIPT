import { type SituacaoMeta } from 'src/modules/assistente/types/situacao-meta';
import { calcularFaltaMeta } from 'src/modules/assistente/utils/calcular-falta-meta.util';
import { formatarPercentualPontos } from 'src/modules/assistente/utils/formatar-percentual-pontos.util';
import { normalizarTextoBusca } from 'src/modules/assistente/utils/normalizar-texto-busca.util';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { formatarValorMeta } from 'src/modules/metas/utils/formatar-valor-meta.util';

const ROTULO_STATUS: Record<string, string> = {
  NO_PRAZO: 'No prazo',
  EM_RISCO: 'Em risco',
  ATRASADA: 'Atrasada',
  CONCLUIDA: 'Concluída',
};

const LIMITE_LINHAS_MENSAGEM = 30;

// Situação de cada meta (já recalculada), com filtro opcional por status e por texto no título.
export const montarSituacaoMetas = ({
  metas,
  hoje,
  status,
  busca,
}: {
  metas: MetaResumo[];
  hoje: string;
  status: string | null;
  busca: string | null;
}): { metas: SituacaoMeta[]; mensagem: string } => {
  const termo = busca ? normalizarTextoBusca(busca) : null;

  const situacoes = metas
    .filter((meta) => (status === null || meta.status === status) && (termo === null || normalizarTextoBusca(meta.titulo).includes(termo)))
    .sort((a, b) => (a.dataFim ?? '9999-12-31').localeCompare(b.dataFim ?? '9999-12-31'))
    .map((meta): SituacaoMeta => {
      const { faltaTotal, faltaPorDia, diasRestantes } = calcularFaltaMeta(meta, hoje);

      return {
        id: meta.id,
        titulo: meta.titulo,
        unidade: meta.unidade,
        valorAtual: meta.valorAtual,
        valorAlvo: meta.valorAlvo,
        valorAtualFormatado: formatarValorMeta(meta.valorAtual, meta.unidade),
        valorAlvoFormatado: formatarValorMeta(meta.valorAlvo, meta.unidade),
        progresso: meta.progresso ?? 0,
        status: meta.status,
        dataFim: meta.dataFim,
        diasRestantes,
        faltaTotal,
        faltaPorDia,
        faltaPorDiaFormatado: faltaPorDia === null ? null : formatarValorMeta(faltaPorDia, meta.unidade),
      };
    });

  if (situacoes.length === 0) {
    return { metas: [], mensagem: 'Nenhuma meta encontrada com esses filtros.' };
  }

  const linhas = situacoes.slice(0, LIMITE_LINHAS_MENSAGEM).map((meta) => {
    const partes = [
      `${meta.valorAtualFormatado} de ${meta.valorAlvoFormatado} (${formatarPercentualPontos(meta.progresso)})`,
      ROTULO_STATUS[meta.status ?? ''] ?? 'Sem status',
    ];

    if (meta.diasRestantes !== null) {
      partes.push(meta.diasRestantes < 0 ? `prazo vencido há ${Math.abs(meta.diasRestantes)} dia(s)` : `${meta.diasRestantes} dia(s) restantes`);
    }

    if (meta.faltaPorDiaFormatado !== null && meta.faltaPorDia !== 0) {
      partes.push(`faltam ${meta.faltaPorDiaFormatado} por dia`);
    }

    return `- ${meta.titulo}: ${partes.join('; ')}.`;
  });

  const resto = situacoes.length - LIMITE_LINHAS_MENSAGEM;

  if (resto > 0) {
    linhas.push(`... e mais ${resto} meta(s) (veja o campo "metas").`);
  }

  return { metas: situacoes, mensagem: [`${situacoes.length} meta(s):`, ...linhas].join('\n') };
};
