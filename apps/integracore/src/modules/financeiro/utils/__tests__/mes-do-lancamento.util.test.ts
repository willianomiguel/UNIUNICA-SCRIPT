import { describe, expect, it } from 'vitest';

import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

describe('mesDoLancamento', () => {
  it('prefere a data e cai para o vencimento', () => {
    expect(mesDoLancamento({ data: '2026-03-10', vencimento: '2026-04-01' })).toBe('2026-03');
    expect(mesDoLancamento({ data: null, vencimento: '2026-04-01' })).toBe('2026-04');
  });

  it('retorna null sem datas', () => {
    expect(mesDoLancamento({ data: null, vencimento: null })).toBeNull();
  });
});
