import { describe, expect, it } from 'vitest';

import { calcularDreSimplificada } from 'src/modules/financeiro/utils/calcular-dre-simplificada.util';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

const lancamento = (dados: Partial<LancamentoResumo>): LancamentoResumo => ({
  id: 'l',
  descricao: 'x',
  tipo: 'SAIDA',
  valor: 0,
  data: null,
  vencimento: null,
  status: 'PAGO',
  recorrencia: 'NENHUMA',
  centroCusto: null,
  categoriaId: null,
  ...dados,
});

describe('calcularDreSimplificada', () => {
  const categorias = [
    { id: 'rec', nome: 'Receita de vendas', tipo: 'ENTRADA' as const, orcamentoMensal: 0 },
    { id: 'ads', nome: 'Tráfego pago', tipo: 'SAIDA' as const, orcamentoMensal: 0 },
  ];

  it('separa receita, custos por categoria e centro de custo', () => {
    const dre = calcularDreSimplificada(
      [
        lancamento({ tipo: 'ENTRADA', valor: 10000, data: '2026-11-02', categoriaId: 'rec' }),
        lancamento({ tipo: 'SAIDA', valor: 3000, data: '2026-11-03', categoriaId: 'ads', centroCusto: 'MARKETING' }),
        lancamento({ tipo: 'SAIDA', valor: 500, data: '2026-11-04', centroCusto: 'DEV' }),
        lancamento({ tipo: 'SAIDA', valor: 200, data: '2026-11-05' }),
        lancamento({ tipo: 'SAIDA', valor: 999, data: '2026-11-05', status: 'CANCELADO' }),
        lancamento({ tipo: 'SAIDA', valor: 999, data: '2026-10-31' }),
      ],
      categorias,
      '2026-11',
    );

    expect(dre.receita).toBe(10000);
    expect(dre.custos).toBe(3700);
    expect(dre.resultado).toBe(6300);
    expect(dre.margem).toBe(63);
    expect(dre.receitasPorCategoria).toEqual([
      { chave: 'rec', nome: 'Receita de vendas', valor: 10000 },
    ]);
    expect(dre.custosPorCategoria).toEqual([
      { chave: 'ads', nome: 'Tráfego pago', valor: 3000 },
      { chave: 'SEM_CATEGORIA', nome: 'Sem categoria', valor: 700 },
    ]);
    expect(dre.custosPorCentroCusto).toEqual([
      { chave: 'MARKETING', nome: 'Marketing', valor: 3000 },
      { chave: 'DEV', nome: 'Desenvolvimento', valor: 500 },
      { chave: 'SEM_CENTRO_CUSTO', nome: 'Sem centro de custo', valor: 200 },
    ]);
  });

  it('margem é null sem receita', () => {
    const dre = calcularDreSimplificada(
      [lancamento({ tipo: 'SAIDA', valor: 100, data: '2026-11-01' })],
      [],
      '2026-11',
    );

    expect(dre.resultado).toBe(-100);
    expect(dre.margem).toBeNull();
  });
});
