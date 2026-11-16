import { describe, expect, it } from 'vitest';

import { mapearNoMetrica } from 'src/modules/trafego/utils/mapear-no-metrica.util';

describe('mapearNoMetrica', () => {
  it('converte gasto de micros e números nulos em 0', () => {
    expect(
      mapearNoMetrica({
        data: '2026-11-14',
        campanhaId: 'c1',
        origem: 'META_ADS',
        impressoes: 100,
        cliques: null,
        gasto: { amountMicros: 5_000_000 },
      }),
    ).toEqual({
      data: '2026-11-14',
      campanhaId: 'c1',
      origem: 'META_ADS',
      impressoes: 100,
      cliques: 0,
      visitas: 0,
      leads: 0,
      conversoes: 0,
      gasto: 5,
    });
  });
});
