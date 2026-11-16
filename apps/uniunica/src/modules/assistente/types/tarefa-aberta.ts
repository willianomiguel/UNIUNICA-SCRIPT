export type TarefaAberta = {
  id: string;
  codigo: string | null;
  titulo: string;
  status: string;
  responsavel: string | null;
  pontos: number | null;
  prioridade: string | null;
};
