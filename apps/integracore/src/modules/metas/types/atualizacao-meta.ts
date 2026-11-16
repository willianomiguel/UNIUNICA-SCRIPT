import { type StatusMeta } from 'src/modules/metas/types/status-meta';

export type AtualizacaoMeta = {
  id: string;
  valorAtual?: number;
  progresso: number;
  status: StatusMeta;
};
