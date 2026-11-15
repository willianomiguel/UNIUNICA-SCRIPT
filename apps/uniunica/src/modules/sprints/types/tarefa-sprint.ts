// Campos de uma tarefa (objeto Task) usados pelo módulo.
export type TarefaSprint = {
  id: string;
  title?: string | null;
  status?: string | null;
  pontos?: number | null;
  tipo?: string | null;
  prioridade?: string | null;
  codigo?: string | null;
  numero?: number | null;
  sprintId?: string | null;
  concluidaEm?: string | null;
  branch?: string | null;
  prUrl?: { primaryLinkUrl?: string | null } | null;
};
