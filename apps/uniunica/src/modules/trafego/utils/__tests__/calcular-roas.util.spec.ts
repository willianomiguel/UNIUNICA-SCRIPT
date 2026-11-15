import { calcularRoas } from 'src/modules/trafego/utils/calcular-roas.util';

describe('calcularRoas', () => {
  it('calcula receita / gasto', () => expect(calcularRoas(900, 300)).toBe(3));
  it('receita zero dá ROAS zero', () => expect(calcularRoas(0, 300)).toBe(0));
  it('sem gasto é null', () => expect(calcularRoas(900, 0)).toBeNull());
});
