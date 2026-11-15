import { describe, expect, it } from 'vitest';

import { obterIntervaloPeriodo } from 'src/modules/vendas/utils/obter-intervalo-periodo.util';

const agora = new Date(2026, 10, 15, 14, 30);

describe('obterIntervaloPeriodo', () => {
  it('starts today at midnight', () => {
    expect(obterIntervaloPeriodo('HOJE', agora)).toEqual({
      inicio: new Date(2026, 10, 15),
      fim: agora,
    });
  });

  it('covers 7 and 30 calendar days including today', () => {
    expect(obterIntervaloPeriodo('7D', agora).inicio).toEqual(new Date(2026, 10, 9));
    expect(obterIntervaloPeriodo('30D', agora).inicio).toEqual(new Date(2026, 9, 17));
  });

  it('starts on the first day of the current month', () => {
    expect(obterIntervaloPeriodo('MES', agora).inicio).toEqual(new Date(2026, 10, 1));
  });
});
