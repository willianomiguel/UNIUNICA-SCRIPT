type TaskLike = { projetoId?: string | null } | null | undefined;

type TaskEvent = {
  properties?: {
    before?: TaskLike;
    after?: TaskLike;
    updatedFields?: string[];
  };
};

const RELEVANT_UPDATED_FIELDS = ['status', 'projeto', 'projetoId'];

// IDs dos projetos cujo progresso pode ter mudado com estes eventos de tarefa.
// Em `task.updated` só contam mudanças de status ou de projeto; criação, exclusão e
// restauração sempre contam. Sem o campo Task.projeto (módulo sprints ausente) devolve [].
export const extractProjetoIdsFromTaskEvents = (
  eventName: string,
  events: TaskEvent[],
): string[] => {
  const isUpdate = eventName.endsWith('.updated');
  const ids = new Set<string>();

  for (const event of events) {
    const properties = event.properties ?? {};

    if (
      isUpdate &&
      !(properties.updatedFields ?? []).some((field) => RELEVANT_UPDATED_FIELDS.includes(field))
    ) {
      continue;
    }

    for (const record of [properties.before, properties.after]) {
      if (typeof record?.projetoId === 'string' && record.projetoId.length > 0) {
        ids.add(record.projetoId);
      }
    }
  }

  return [...ids];
};
