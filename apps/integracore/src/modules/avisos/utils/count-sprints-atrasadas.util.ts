const FINALIZADAS = new Set(['CONCLUIDA', 'CANCELADA']);

// Sprint atrasada = não finalizada e com dataFim antes de hoje.
export const countSprintsAtrasadas = (
  sprints: Array<{ status?: unknown; dataFim?: unknown }>,
  today: string,
): number =>
  sprints.filter(
    (sprint) =>
      !FINALIZADAS.has(String(sprint.status)) &&
      typeof sprint.dataFim === 'string' &&
      sprint.dataFim.slice(0, 10) < today,
  ).length;
