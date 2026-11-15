// Ideia como vem da API REST (/rest/ideias).
export type IdeiaRecord = {
  id: string;
  titulo?: string | null;
  descricao?: { markdown?: string | null; blocknote?: string | null } | null;
  area?: string | null;
  status?: string | null;
  impacto?: number | null;
  esforco?: number | null;
  votos?: number | null;
  pontuacao?: number | null;
  autorId?: string | null;
  projetoId?: string | null;
};
