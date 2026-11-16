export type SituacaoMeta = {
  id: string;
  titulo: string;
  unidade: string;
  valorAtual: number | null;
  valorAlvo: number | null;
  valorAtualFormatado: string;
  valorAlvoFormatado: string;
  progresso: number;
  status: string | null;
  dataFim: string | null;
  diasRestantes: number | null;
  // Quanto falta no total e por dia (contando hoje) para bater; null sem prazo futuro ou sem alvo.
  faltaTotal: number | null;
  faltaPorDia: number | null;
  faltaPorDiaFormatado: string | null;
};
