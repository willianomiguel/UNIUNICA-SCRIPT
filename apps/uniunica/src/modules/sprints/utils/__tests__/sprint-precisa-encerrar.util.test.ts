import { describe, expect, it } from 'vitest';

import { sprintPrecisaEncerrar } from 'src/modules/sprints/utils/sprint-precisa-encerrar.util';

describe('sprintPrecisaEncerrar', () => {
  it('sprint ativa vencida precisa encerrar', () => {
    expect(sprintPrecisaEncerrar({ status: 'ATIVA', dataFim: '2026-11-14' }, '2026-11-15')).toBe(true);
  });

  it('no último dia ainda não', () => {
    expect(sprintPrecisaEncerrar({ status: 'ATIVA', dataFim: '2026-11-15' }, '2026-11-15')).toBe(false);
  });

  it('só vale para sprints ativas com data de fim', () => {
    expect(sprintPrecisaEncerrar({ status: 'PLANEJADA', dataFim: '2026-11-01' }, '2026-11-15')).toBe(false);
    expect(sprintPrecisaEncerrar({ status: 'ATIVA', dataFim: null }, '2026-11-15')).toBe(false);
  });
});
