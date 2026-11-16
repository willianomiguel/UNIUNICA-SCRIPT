// Campos de uma tarefa (objeto Task) usados pelo assistente.
export type TarefaAssistente = {
  id: string;
  title?: string | null;
  status?: string | null;
  pontos?: number | null;
  prioridade?: string | null;
  codigo?: string | null;
  assigneeId?: string | null;
};
