import { describe, expect, it } from 'vitest';

import { montarNomeMetrica } from 'src/modules/trafego/utils/montar-nome-metrica.util';

describe('montarNomeMetrica', () => {
  it('prefere o nome da campanha encontrada', () => {
    expect(
      montarNomeMetrica(
        { origem: 'META_ADS', data: '2026-11-14', pagina: null, campanha: { idExterno: '1' } },
        'Black Friday',
      ),
    ).toBe('Meta Ads · Black Friday · 2026-11-14');
  });
  it('cai em utm, página e "Geral"', () => {
    expect(
      montarNomeMetrica({ origem: 'SITE', data: '2026-11-14', pagina: '/oferta', campanha: null }),
    ).toBe('Site · /oferta · 2026-11-14');
    expect(
      montarNomeMetrica({ origem: 'MANUAL', data: '2026-11-14', pagina: null, campanha: null }),
    ).toBe('Manual · Geral · 2026-11-14');
  });
});
