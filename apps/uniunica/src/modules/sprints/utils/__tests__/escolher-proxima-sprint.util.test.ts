import { describe, expect, it } from 'vitest';

import { escolherProximaSprint } from 'src/modules/sprints/utils/escolher-proxima-sprint.util';

const atual = { id: 'a', status: 'ATIVA', projetoId: 'p1', dataInicio: '2026-11-10' };

describe('escolherProximaSprint', () => {
  it('prefere a planejada mais próxima do mesmo projeto', () => {
    expect(
      escolherProximaSprint(atual, [
        atual,
        { id: 'b', status: 'PLANEJADA', projetoId: 'p2', dataInicio: '2026-11-20' },
        { id: 'c', status: 'PLANEJADA', projetoId: 'p1', dataInicio: '2026-12-08' },
        { id: 'd', status: 'PLANEJADA', projetoId: 'p1', dataInicio: '2026-11-24' },
      ])?.id,
    ).toBe('d');
  });

  it('sem projeto igual, usa a planejada mais próxima', () => {
    expect(
      escolherProximaSprint(atual, [
        { id: 'b', status: 'PLANEJADA', projetoId: 'p2', dataInicio: '2026-11-30' },
        { id: 'c', status: 'PLANEJADA', dataInicio: '2026-11-24' },
        { id: 'e', status: 'PLANEJADA' },
      ])?.id,
    ).toBe('c');
  });

  it('sem planejadas devolve null (backlog)', () => {
    expect(
      escolherProximaSprint(atual, [
        atual,
        { id: 'x', status: 'CONCLUIDA' },
        { id: 'y', status: 'CANCELADA' },
      ]),
    ).toBeNull();
  });
});
