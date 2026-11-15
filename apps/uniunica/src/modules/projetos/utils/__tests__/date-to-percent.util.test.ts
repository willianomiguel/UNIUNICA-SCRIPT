import { describe, expect, it } from 'vitest';

import { dateToPercent } from 'src/modules/projetos/utils/date-to-percent.util';

const range = { startMs: 0, endMs: 1000 };

describe('dateToPercent', () => {
  it('converte proporcionalmente', () => {
    expect(dateToPercent(250, range)).toBe(25);
  });

  it('limita às bordas', () => {
    expect(dateToPercent(-10, range)).toBe(0);
    expect(dateToPercent(2000, range)).toBe(100);
  });

  it('intervalo vazio devolve 0', () => {
    expect(dateToPercent(5, { startMs: 10, endMs: 10 })).toBe(0);
  });
});
