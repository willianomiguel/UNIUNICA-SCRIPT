import { describe, expect, it } from 'vitest';

import { extractProjetoIdsFromTaskEvents } from 'src/modules/projetos/utils/extract-projeto-ids-from-task-events.util';

describe('extractProjetoIdsFromTaskEvents', () => {
  it('em atualização, considera só mudanças de status ou projeto (antes e depois)', () => {
    const ids = extractProjetoIdsFromTaskEvents('task.updated', [
      { properties: { updatedFields: ['status'], before: { projetoId: 'p1' }, after: { projetoId: 'p1' } } },
      { properties: { updatedFields: ['projetoId'], before: { projetoId: 'p2' }, after: { projetoId: 'p3' } } },
      { properties: { updatedFields: ['title'], before: { projetoId: 'p4' }, after: { projetoId: 'p4' } } },
    ]);

    expect(ids).toEqual(['p1', 'p2', 'p3']);
  });

  it('em criação e exclusão sempre considera', () => {
    expect(extractProjetoIdsFromTaskEvents('task.created', [{ properties: { after: { projetoId: 'p1' } } }])).toEqual(['p1']);
    expect(extractProjetoIdsFromTaskEvents('task.deleted', [{ properties: { before: { projetoId: 'p2' } } }])).toEqual(['p2']);
  });

  it('sem o campo projeto (módulo sprints ausente) não devolve nada', () => {
    expect(
      extractProjetoIdsFromTaskEvents('task.updated', [
        { properties: { updatedFields: ['status'], before: {}, after: {} } },
      ]),
    ).toEqual([]);
    expect(extractProjetoIdsFromTaskEvents('task.created', [{}])).toEqual([]);
  });
});
