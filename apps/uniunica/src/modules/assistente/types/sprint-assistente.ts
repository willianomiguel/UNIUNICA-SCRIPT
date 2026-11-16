// Campos de uma sprint usados pelo assistente.
export type SprintAssistente = {
  id: string;
  nome?: string | null;
  objetivo?: string | null;
  status?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  pontosTotais?: number | null;
  pontosConcluidos?: number | null;
  capacidadePontos?: number | null;
};
