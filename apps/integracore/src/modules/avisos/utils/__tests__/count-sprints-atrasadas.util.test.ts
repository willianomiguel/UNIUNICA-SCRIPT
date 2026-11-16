import { describe, expect, it } from 'vitest';

import { countSprintsAtrasadas } from 'src/modules/avisos/utils/count-sprints-atrasadas.util';

describe('countSprintsAtrasadas', () => {
  it('conta sprints não finalizadas com dataFim no passado', () => {
    expect(
      countSprintsAtrasadas(
        [
          { status: 'ATIVA', dataFim: '2026-11-10' },
          { status: 'PLANEJADA', dataFim: '2026-11-01' },
          { status: 'CONCLUIDA', dataFim: '2026-11-01' },
          { status: 'CANCELADA', dataFim: '2026-11-01' },
          { status: 'ATIVA', dataFim: '2026-11-15' },
          { status: 'ATIVA', dataFim: null },
        ],
        '2026-11-15',
      ),
    ).toBe(2);
  });
});
