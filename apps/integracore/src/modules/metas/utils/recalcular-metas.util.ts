import { type AtualizacaoMeta } from 'src/modules/metas/types/atualizacao-meta';
import { type DadosFontes } from 'src/modules/metas/types/dados-fontes';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { calcularProgressoMeta } from 'src/modules/metas/utils/calcular-progresso-meta.util';
import { calcularStatusMeta } from 'src/modules/metas/utils/calcular-status-meta.util';
import { calcularValorFonte } from 'src/modules/metas/utils/calcular-valor-fonte.util';

// Recalcula valor atual (fontes automáticas), progresso e status de todas as
// metas. Metas com submetas usam a média do progresso das submetas (em
// qualquer profundidade). Devolve só as metas cujo valor mudou.
export const recalcularMetas = (
  metas: MetaResumo[],
  dados: DadosFontes,
  hoje: string,
): AtualizacaoMeta[] => {
  const porId = new Map(metas.map((meta) => [meta.id, meta]));
  const filhos = new Map<string, MetaResumo[]>();

  for (const meta of metas) {
    if (meta.metaPaiId && porId.has(meta.metaPaiId)) {
      filhos.set(meta.metaPaiId, [...(filhos.get(meta.metaPaiId) ?? []), meta]);
    }
  }

  const valoresAtuais = new Map<string, number | null>();
  const progressos = new Map<string, number>();

  const valorAtualDe = (meta: MetaResumo): number | null => {
    if (!valoresAtuais.has(meta.id)) {
      const calculado =
        meta.fonte === 'MANUAL'
          ? null
          : calcularValorFonte(meta.fonte, dados, meta.dataInicio, meta.dataFim);

      valoresAtuais.set(meta.id, calculado);
    }

    return valoresAtuais.get(meta.id) ?? meta.valorAtual;
  };

  const progressoDe = (meta: MetaResumo, visitando: Set<string>): number => {
    const conhecido = progressos.get(meta.id);

    if (conhecido !== undefined) return conhecido;

    const submetas = (filhos.get(meta.id) ?? []).filter(
      (submeta) => !visitando.has(submeta.id),
    );
    let progresso: number;

    if (submetas.length > 0) {
      const proximoCaminho = new Set(visitando).add(meta.id);
      const soma = submetas.reduce(
        (total, submeta) => total + progressoDe(submeta, proximoCaminho),
        0,
      );

      progresso = Math.round((soma / submetas.length) * 10) / 10;
    } else {
      progresso = calcularProgressoMeta(meta.valorInicial, meta.valorAlvo, valorAtualDe(meta));
    }

    progressos.set(meta.id, progresso);

    return progresso;
  };

  const atualizacoes: AtualizacaoMeta[] = [];

  for (const meta of metas) {
    const progresso = progressoDe(meta, new Set());
    const status = calcularStatusMeta(progresso, meta.dataInicio, meta.dataFim, hoje);
    const novoValor = valoresAtuais.get(meta.id) ?? null;
    const atualizacao: AtualizacaoMeta = { id: meta.id, progresso, status };
    let mudou = progresso !== meta.progresso || status !== meta.status;

    if (novoValor !== null && novoValor !== meta.valorAtual) {
      atualizacao.valorAtual = novoValor;
      mudou = true;
    }

    if (mudou) atualizacoes.push(atualizacao);
  }

  return atualizacoes;
};
