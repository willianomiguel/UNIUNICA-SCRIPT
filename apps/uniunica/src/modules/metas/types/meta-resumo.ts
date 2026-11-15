import { type FonteMeta } from 'src/modules/metas/types/fonte-meta';
import { type StatusMeta } from 'src/modules/metas/types/status-meta';

export type MetaResumo = {
  id: string;
  titulo: string;
  fonte: FonteMeta;
  unidade: string;
  periodo: string | null;
  dataInicio: string | null;
  dataFim: string | null;
  valorInicial: number;
  valorAlvo: number | null;
  valorAtual: number | null;
  progresso: number | null;
  status: StatusMeta | null;
  metaPaiId: string | null;
};
