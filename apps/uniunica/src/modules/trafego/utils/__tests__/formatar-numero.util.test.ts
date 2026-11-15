import { formatarNumero } from 'src/modules/trafego/utils/formatar-numero.util';

describe('formatarNumero', () => {
  it('usa separadores brasileiros', () => {
    expect(formatarNumero(12345)).toBe('12.345');
    expect(formatarNumero(2.5, 2)).toBe('2,50');
  });
  it('vazio vira traço', () => expect(formatarNumero(undefined)).toBe('—'));
});
