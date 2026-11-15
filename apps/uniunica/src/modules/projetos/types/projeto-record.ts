// Projeto como vem da API REST (/rest/projetos).
export type ProjetoRecord = {
  id: string;
  nome?: string | null;
  status?: string | null;
  prioridade?: string | null;
  area?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  progresso?: number | null;
  trimestre?: string | null;
};
