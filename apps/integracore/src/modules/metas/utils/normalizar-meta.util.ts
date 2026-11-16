import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';
import { type FonteMeta } from 'src/modules/metas/types/fonte-meta';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { type StatusMeta } from 'src/modules/metas/types/status-meta';

const numero = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === '') return null;

  const convertido = Number(valor);

  return Number.isFinite(convertido) ? convertido : null;
};

const texto = (valor: unknown): string | null =>
  typeof valor === 'string' && valor.length > 0 ? valor : null;

export const normalizarMeta = (registro: RegistroIntegraCore): MetaResumo => ({
  id: registro.id,
  titulo: texto(registro.titulo) ?? 'Meta sem título',
  fonte: (texto(registro.fonte) ?? 'MANUAL') as FonteMeta,
  unidade: texto(registro.unidade) ?? 'QUANTIDADE',
  periodo: texto(registro.periodo),
  dataInicio: texto(registro.dataInicio)?.slice(0, 10) ?? null,
  dataFim: texto(registro.dataFim)?.slice(0, 10) ?? null,
  valorInicial: numero(registro.valorInicial) ?? 0,
  valorAlvo: numero(registro.valorAlvo),
  valorAtual: numero(registro.valorAtual),
  progresso: numero(registro.progresso),
  status: texto(registro.status) as StatusMeta | null,
  metaPaiId: texto(registro.metaPaiId),
});
