import { describe, expect, it } from 'vitest';

import { somarMetricas } from 'src/modules/trafego/utils/somar-metricas.util';

describe('somarMetricas', () => {
  it('soma todas as colunas', () => {
    expect(
      somarMetricas([
        { impressoes: 100, cliques: 10, visitas: 8, leads: 2, conversoes: 1, gasto: 10.5 },
        { impressoes: 50, cliques: 5, visitas: 4, leads: 1, conversoes: 0, gasto: 4.5 },
      ]),
    ).toEqual({ impressoes: 150, cliques: 15, visitas: 12, leads: 3, conversoes: 1, gasto: 15 });
  });
  it('lista vazia dá zeros', () => expect(somarMetricas([]).gasto).toBe(0));
});
