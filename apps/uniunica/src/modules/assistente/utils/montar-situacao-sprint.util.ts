import { LIMITES_ASSISTENTE } from 'src/modules/assistente/constants/assistente-limites';
import { type MembroWorkspace } from 'src/modules/assistente/types/membro-workspace';
import { type SituacaoSprint } from 'src/modules/assistente/types/situacao-sprint';
import { type SprintAssistente } from 'src/modules/assistente/types/sprint-assistente';
import { type TarefaAberta } from 'src/modules/assistente/types/tarefa-aberta';
import { type TarefaAssistente } from 'src/modules/assistente/types/tarefa-assistente';
import { formatarDataBr } from 'src/modules/assistente/utils/formatar-data-br.util';
import { formatarPercentualPontos } from 'src/modules/assistente/utils/formatar-percentual-pontos.util';
import { calcularDiasRestantes } from 'src/modules/metas/utils/calcular-dias-restantes.util';
import { calcularTempoDecorrido } from 'src/modules/metas/utils/calcular-tempo-decorrido.util';
import { calcularPontosSprint } from 'src/modules/sprints/utils/calcular-pontos-sprint.util';

const ROTULO_STATUS_TAREFA: Record<string, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
};

const PESO_PRIORIDADE: Record<string, number> = { URGENTE: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };

const nomeDoMembro = (membro: MembroWorkspace | undefined): string | null => {
  const nome = [membro?.name?.firstName, membro?.name?.lastName].filter(Boolean).join(' ');

  return nome === '' ? null : nome;
};

// Situação da sprint a partir da sprint, suas tarefas e os membros (função pura).
// Os pontos vêm das tarefas (mesma regra do módulo sprints), não dos campos gravados.
export const montarSituacaoSprint = ({
  sprint,
  tarefas,
  membros,
  hoje,
}: {
  sprint: SprintAssistente;
  tarefas: TarefaAssistente[];
  membros: MembroWorkspace[];
  hoje: string;
}): SituacaoSprint => {
  const { pontosTotais, pontosConcluidos } = calcularPontosSprint(tarefas);
  const percentualConcluido = pontosTotais > 0 ? Math.round((pontosConcluidos / pontosTotais) * 1000) / 10 : 0;
  const dataInicio = sprint.dataInicio?.slice(0, 10) ?? null;
  const dataFim = sprint.dataFim?.slice(0, 10) ?? null;
  const percentualTempoDecorrido = calcularTempoDecorrido(dataInicio, dataFim, hoje);
  const diasRestantes = calcularDiasRestantes(dataFim, hoje);
  const ativa = sprint.status === 'ATIVA';
  const atrasadaPeloRitmo =
    ativa &&
    ((diasRestantes !== null && diasRestantes < 0 && percentualConcluido < 100) ||
      (percentualTempoDecorrido !== null &&
        percentualConcluido < percentualTempoDecorrido - LIMITES_ASSISTENTE.toleranciaRitmoSprint));

  const nomePorMembro = new Map(membros.map((membro) => [membro.id, nomeDoMembro(membro)]));
  const abertas = tarefas
    .filter((tarefa) => tarefa.status !== 'DONE')
    .sort(
      (a, b) =>
        Number(b.status === 'IN_PROGRESS') - Number(a.status === 'IN_PROGRESS') ||
        (PESO_PRIORIDADE[a.prioridade ?? ''] ?? 9) - (PESO_PRIORIDADE[b.prioridade ?? ''] ?? 9),
    );
  const tarefasAbertas = abertas.slice(0, LIMITES_ASSISTENTE.tarefasAbertas).map(
    (tarefa): TarefaAberta => ({
      id: tarefa.id,
      codigo: tarefa.codigo ?? null,
      titulo: tarefa.title ?? 'Sem título',
      status: tarefa.status ?? 'TODO',
      responsavel: tarefa.assigneeId ? (nomePorMembro.get(tarefa.assigneeId) ?? null) : null,
      pontos: tarefa.pontos ?? null,
      prioridade: tarefa.prioridade ?? null,
    }),
  );

  const nome = sprint.nome ?? 'Sprint sem nome';
  const linhas = [
    `${nome} (${sprint.status ?? 'sem status'})${dataInicio && dataFim ? `, ${formatarDataBr(dataInicio)} a ${formatarDataBr(dataFim)}` : ''}.`,
  ];

  if (sprint.objetivo) {
    linhas.push(`- Objetivo: ${sprint.objetivo}`);
  }

  if (diasRestantes !== null) {
    linhas.push(diasRestantes < 0 ? `- Prazo vencido há ${Math.abs(diasRestantes)} dia(s).` : `- ${diasRestantes} dia(s) restantes.`);
  }

  linhas.push(
    `- Pontos: ${pontosConcluidos} de ${pontosTotais} concluídos (${formatarPercentualPontos(percentualConcluido)})${sprint.capacidadePontos != null ? `; capacidade ${sprint.capacidadePontos}` : ''}.`,
  );

  if (percentualTempoDecorrido !== null) {
    linhas.push(
      `- Tempo decorrido ${formatarPercentualPontos(percentualTempoDecorrido)}: ${atrasadaPeloRitmo ? 'ATRASADA pelo ritmo' : 'ritmo ok'}.`,
    );
  }

  linhas.push(`- ${abertas.length} tarefa(s) aberta(s)${abertas.length > tarefasAbertas.length ? ` (mostrando ${tarefasAbertas.length})` : ''}.`);

  for (const tarefa of tarefasAbertas) {
    linhas.push(
      `  * ${tarefa.codigo ? `${tarefa.codigo} ` : ''}${tarefa.titulo} [${ROTULO_STATUS_TAREFA[tarefa.status] ?? tarefa.status}]${tarefa.responsavel ? ` - ${tarefa.responsavel}` : ''}`,
    );
  }

  return {
    id: sprint.id,
    nome,
    objetivo: sprint.objetivo ?? null,
    status: sprint.status ?? null,
    dataInicio,
    dataFim,
    diasRestantes,
    pontosTotais,
    pontosConcluidos,
    capacidadePontos: sprint.capacidadePontos ?? null,
    percentualConcluido,
    percentualTempoDecorrido,
    atrasadaPeloRitmo,
    tarefasAbertasTotal: abertas.length,
    tarefasAbertas,
    mensagem: linhas.join('\n'),
  };
};
