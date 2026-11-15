import { calcularIndicadores } from 'src/modules/trafego/utils/calcular-indicadores.util';

const totais = { impressoes: 10000, cliques: 200, visitas: 150, leads: 20, conversoes: 5, gasto: 400 };

describe('calcularIndicadores', () => {
  it('usa vendas aprovadas no CPA quando existem', () => {
    expect(calcularIndicadores({ totais, receita: 1600, vendas: 8 })).toEqual({
      ctr: 2,
      cpc: 2,
      cpm: 40,
      cpl: 20,
      cpa: 50,
      roas: 4,
    });
  });

  it('cai nas conversões da plataforma quando não há vendas', () => {
    expect(calcularIndicadores({ totais, receita: 0, vendas: 0 }).cpa).toBe(80);
  });

  it('tudo null quando não há dados', () => {
    const vazio = { impressoes: 0, cliques: 0, visitas: 0, leads: 0, conversoes: 0, gasto: 0 };

    expect(calcularIndicadores({ totais: vazio, receita: 0, vendas: 0 })).toEqual({
      ctr: null,
      cpc: null,
      cpm: null,
      cpl: null,
      cpa: null,
      roas: null,
    });
  });
});
