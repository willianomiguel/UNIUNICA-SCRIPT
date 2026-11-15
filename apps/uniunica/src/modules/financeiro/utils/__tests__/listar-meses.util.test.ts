import { describe, expect, it } from 'vitest';

import { listarMeses } from 'src/modules/financeiro/utils/listar-meses.util';

describe('listarMeses', () => {
  it('lista meses atravessando o ano', () => {
    expect(listarMeses('2025-11', '2026-02')).toEqual([
      '2025-11',
      '2025-12',
      '2026-01',
      '2026-02',
    ]);
  });

  it('retorna um mês quando início = fim e vazio quando invertido', () => {
    expect(listarMeses('2026-05', '2026-05')).toEqual(['2026-05']);
    expect(listarMeses('2026-06', '2026-05')).toEqual([]);
  });
});
