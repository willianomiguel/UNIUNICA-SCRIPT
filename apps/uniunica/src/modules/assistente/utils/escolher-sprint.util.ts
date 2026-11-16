import { type SprintAssistente } from 'src/modules/assistente/types/sprint-assistente';

// Sprint pedida por id; sem id, a ATIVA (se houver mais de uma, a de início mais recente).
export const escolherSprint = (
  sprints: SprintAssistente[],
  sprintId: string | null,
): SprintAssistente | null => {
  if (sprintId !== null) {
    return sprints.find((sprint) => sprint.id === sprintId) ?? null;
  }

  return (
    sprints
      .filter((sprint) => sprint.status === 'ATIVA')
      .sort((a, b) => (b.dataInicio ?? '').localeCompare(a.dataInicio ?? ''))[0] ?? null
  );
};
