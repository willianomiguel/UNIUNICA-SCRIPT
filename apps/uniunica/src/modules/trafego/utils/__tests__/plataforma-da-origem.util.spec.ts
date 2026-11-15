import { plataformaDaOrigem } from 'src/modules/trafego/utils/plataforma-da-origem.util';

describe('plataformaDaOrigem', () => {
  it('mapeia origens de anúncios para a mesma plataforma', () => {
    expect(plataformaDaOrigem('META_ADS')).toBe('META_ADS');
    expect(plataformaDaOrigem('GOOGLE_ADS')).toBe('GOOGLE_ADS');
    expect(plataformaDaOrigem('TIKTOK_ADS')).toBe('TIKTOK_ADS');
  });
  it('site vira orgânico e manual vira outro', () => {
    expect(plataformaDaOrigem('SITE')).toBe('ORGANICO');
    expect(plataformaDaOrigem('MANUAL')).toBe('OUTRO');
  });
});
