import { montarChaveMetrica } from 'src/modules/trafego/utils/montar-chave-metrica.util';

describe('montarChaveMetrica', () => {
  it('monta prefixo:referencia:data', () => {
    expect(montarChaveMetrica({ origem: 'META_ADS', referencia: '1202', data: '2026-11-14' })).toBe(
      'meta:1202:2026-11-14',
    );
  });
  it('normaliza a referência e usa "geral" quando falta', () => {
    expect(montarChaveMetrica({ origem: 'SITE', referencia: ' /Oferta ', data: '2026-11-14' })).toBe(
      'site:/oferta:2026-11-14',
    );
    expect(montarChaveMetrica({ origem: 'MANUAL', referencia: null, data: '2026-11-14' })).toBe(
      'manual:geral:2026-11-14',
    );
  });
});
