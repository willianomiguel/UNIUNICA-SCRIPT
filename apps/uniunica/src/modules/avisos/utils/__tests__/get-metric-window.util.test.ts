import { describe, expect, it } from 'vitest';

import { getMetricWindow } from 'src/modules/avisos/utils/get-metric-window.util';

describe('getMetricWindow', () => {
  it('usa o dia de São Paulo (UTC-3)', () => {
    const window = getMetricWindow(new Date('2026-11-15T02:30:00Z'), 30);

    expect(window.today).toBe('2026-11-14');
    expect(window.startOfTodayIso).toBe('2026-11-14T00:00:00-03:00');
    expect(window.windowStartIso).toBe('2026-10-16T02:30:00.000Z');
  });

  it('trata janela inválida como 1 dia', () => {
    expect(getMetricWindow(new Date('2026-11-15T12:00:00Z'), 0).windowStartIso).toBe(
      '2026-11-14T12:00:00.000Z',
    );
  });
});
