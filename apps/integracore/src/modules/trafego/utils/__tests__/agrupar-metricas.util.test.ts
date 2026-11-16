import { describe, expect, it } from 'vitest';

import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { agruparMetricas } from 'src/modules/trafego/utils/agrupar-metricas.util';

const linha = (parcial: Partial<LinhaMetrica>): LinhaMetrica => ({
  data: '2026-11-10',
  campanhaId: null,
  origem: 'META_ADS',
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto: 0,
  ...parcial,
});

describe('agruparMetricas', () => {
  it('agrupa pela chave informada e soma', () => {
    const grupos = agruparMetricas(
      [linha({ origem: 'A', cliques: 1 }), linha({ origem: 'A', cliques: 2 }), linha({ origem: 'B', cliques: 5 })],
      (item) => item.origem ?? '',
    );

    expect(grupos.A.cliques).toBe(3);
    expect(grupos.B.cliques).toBe(5);
  });
  it('lista vazia dá objeto vazio', () => expect(agruparMetricas([], () => 'x')).toEqual({}));
});
