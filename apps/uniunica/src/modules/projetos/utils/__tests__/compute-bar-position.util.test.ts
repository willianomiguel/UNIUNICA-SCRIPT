import { describe, expect, it } from 'vitest';

import { computeBarPosition } from 'src/modules/projetos/utils/compute-bar-position.util';

// Out/2026 a dez/2026 = 92 dias (61 + 31): out 31, nov 30, dez 31.
const range = { startMs: Date.UTC(2026, 9, 1), endMs: Date.UTC(2027, 0, 1) };

describe('computeBarPosition', () => {
  it('posiciona de dataInicio até o fim do dia de dataFim', () => {
    const bar = computeBarPosition('2026-10-01', '2026-10-31', range);

    expect(bar?.leftPercent).toBe(0);
    expect(bar?.widthPercent).toBeCloseTo((31 / 92) * 100, 5);
    expect(bar?.isClippedStart).toBe(false);
    expect(bar?.isClippedEnd).toBe(false);
  });

  it('corta barras que extrapolam o intervalo', () => {
    const bar = computeBarPosition('2026-09-01', '2027-02-01', range);

    expect(bar).toEqual({ leftPercent: 0, widthPercent: 100, isClippedStart: true, isClippedEnd: true });
  });

  it('com só uma data ocupa um dia (com largura mínima)', () => {
    const bar = computeBarPosition(null, '2026-11-15', range);

    expect(bar?.leftPercent).toBeCloseTo((45 / 92) * 100, 5);
    expect(bar?.widthPercent).toBeCloseTo(Math.max((1 / 92) * 100, 0.8), 5);
  });

  it('inverte datas trocadas', () => {
    expect(computeBarPosition('2026-10-31', '2026-10-01', range)).toEqual(
      computeBarPosition('2026-10-01', '2026-10-31', range),
    );
  });

  it('não cola a largura mínima para fora da borda direita', () => {
    const bar = computeBarPosition('2026-12-31', '2026-12-31', range);

    expect((bar?.leftPercent ?? 0) + (bar?.widthPercent ?? 0)).toBeLessThanOrEqual(100);
  });

  it('devolve null sem datas ou fora do intervalo', () => {
    expect(computeBarPosition(null, null, range)).toBeNull();
    expect(computeBarPosition('2026-01-01', '2026-03-01', range)).toBeNull();
    expect(computeBarPosition('2027-01-01', '2027-03-01', range)).toBeNull();
  });
});
