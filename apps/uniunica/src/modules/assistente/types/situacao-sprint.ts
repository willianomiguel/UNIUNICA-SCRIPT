import { type TarefaAberta } from 'src/modules/assistente/types/tarefa-aberta';

export type SituacaoSprint = {
  id: string;
  nome: string;
  objetivo: string | null;
  status: string | null;
  dataInicio: string | null;
  dataFim: string | null;
  diasRestantes: number | null;
  pontosTotais: number;
  pontosConcluidos: number;
  capacidadePontos: number | null;
  percentualConcluido: number;
  percentualTempoDecorrido: number | null;
  atrasadaPeloRitmo: boolean;
  tarefasAbertasTotal: number;
  tarefasAbertas: TarefaAberta[];
  mensagem: string;
};
