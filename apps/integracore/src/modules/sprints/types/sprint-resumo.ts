// Campos de uma sprint usados pela lógica do módulo.
export type SprintResumo = {
  id: string;
  nome?: string | null;
  status?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  projetoId?: string | null;
  pontosTotais?: number | null;
  pontosConcluidos?: number | null;
  capacidadePontos?: number | null;
  historicoBurndown?: unknown;
  precisaEncerrar?: boolean | null;
};
