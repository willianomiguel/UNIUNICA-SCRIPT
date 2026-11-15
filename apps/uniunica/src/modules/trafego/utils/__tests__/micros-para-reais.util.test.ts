import { microsParaReais } from 'src/modules/trafego/utils/micros-para-reais.util';

describe('microsParaReais', () => {
  it('converte micros em reais', () => expect(microsParaReais(12_340_000)).toBe(12.34));
  it('aceita string', () => expect(microsParaReais('5000000')).toBe(5));
  it('nulo/vazio/inválido vira 0', () => {
    expect(microsParaReais(null)).toBe(0);
    expect(microsParaReais(undefined)).toBe(0);
    expect(microsParaReais('')).toBe(0);
    expect(microsParaReais('abc')).toBe(0);
  });
});
