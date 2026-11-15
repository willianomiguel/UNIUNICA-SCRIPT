import { normalizarOrigem } from 'src/modules/trafego/utils/normalizar-origem.util';

describe('normalizarOrigem', () => {
  it('aceita valores válidos e apelidos', () => {
    expect(normalizarOrigem('GOOGLE_ADS')).toBe('GOOGLE_ADS');
    expect(normalizarOrigem('google-ads')).toBe('GOOGLE_ADS');
    expect(normalizarOrigem('facebook')).toBe('META_ADS');
    expect(normalizarOrigem('tiktok')).toBe('TIKTOK_ADS');
  });
  it('desconhecido usa o padrão', () => {
    expect(normalizarOrigem('xpto')).toBe('MANUAL');
    expect(normalizarOrigem(undefined, 'SITE')).toBe('SITE');
  });
});
