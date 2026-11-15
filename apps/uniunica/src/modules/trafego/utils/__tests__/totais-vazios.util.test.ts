import { totaisVazios } from 'src/modules/trafego/utils/totais-vazios.util';

describe('totaisVazios', () => {
  it('zera todos os totais e devolve objeto novo a cada chamada', () => {
    const a = totaisVazios();

    expect(a).toEqual({ impressoes: 0, cliques: 0, visitas: 0, leads: 0, conversoes: 0, gasto: 0 });
    expect(totaisVazios()).not.toBe(a);
  });
});
