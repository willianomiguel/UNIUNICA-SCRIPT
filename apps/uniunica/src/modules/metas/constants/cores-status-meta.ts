import { type StatusMeta } from 'src/modules/metas/types/status-meta';

// Rótulo e cor (nome da paleta do tema) de cada status.
export const CORES_STATUS_META: Record<StatusMeta, { rotulo: string; cor: 'green' | 'orange' | 'red' | 'blue' }> = {
  NO_PRAZO: { rotulo: 'No prazo', cor: 'green' },
  EM_RISCO: { rotulo: 'Em risco', cor: 'orange' },
  ATRASADA: { rotulo: 'Atrasada', cor: 'red' },
  CONCLUIDA: { rotulo: 'Concluída', cor: 'blue' },
};
