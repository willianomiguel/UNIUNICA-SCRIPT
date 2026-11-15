const DONE_STATUS = 'DONE';

// Progresso (0–100, inteiro) = tarefas com status DONE ÷ total de tarefas.
// Sem tarefas devolve null, para não sobrescrever um progresso informado à mão.
export const calcularProgressoProjeto = (
  statuses: Array<string | null | undefined>,
): number | null => {
  if (statuses.length === 0) {
    return null;
  }

  const done = statuses.filter((status) => status === DONE_STATUS).length;

  return Math.round((done / statuses.length) * 100);
};
