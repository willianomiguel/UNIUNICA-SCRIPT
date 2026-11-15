import { extrairAcaoMeta } from 'src/modules/trafego/utils/extrair-acao-meta.util';

describe('extrairAcaoMeta', () => {
  const acoes = [
    { action_type: 'offsite_conversion.fb_pixel_lead', value: '3' },
    { action_type: 'lead', value: '5' },
  ];

  it('usa o primeiro tipo preferido presente (sem somar duplicados)', () => {
    expect(extrairAcaoMeta(acoes, ['lead', 'offsite_conversion.fb_pixel_lead'])).toBe(5);
    expect(extrairAcaoMeta(acoes, ['onsite_conversion.lead_grouped', 'offsite_conversion.fb_pixel_lead'])).toBe(3);
  });
  it('sem ações devolve 0', () => {
    expect(extrairAcaoMeta(undefined, ['lead'])).toBe(0);
    expect(extrairAcaoMeta(acoes, ['purchase'])).toBe(0);
  });
});
