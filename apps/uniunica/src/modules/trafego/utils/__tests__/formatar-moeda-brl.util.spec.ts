import { formatarMoedaBrl } from 'src/modules/trafego/utils/formatar-moeda-brl.util';

describe('formatarMoedaBrl', () => {
  it('formata em reais', () => expect(formatarMoedaBrl(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50'));
  it('vazio vira traço', () => {
    expect(formatarMoedaBrl(null)).toBe('—');
    expect(formatarMoedaBrl(Number.NaN)).toBe('—');
  });
});
