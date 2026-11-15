import { describe, expect, it } from 'vitest';

import { calcularOrcadoRealizado } from 'src/modules/financeiro/utils/calcular-orcado-realizado.util';
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

describe('calcularOrcadoRealizado', () => {
  const categorias = [
    { id: 'ads', nome: 'Tráfego pago', tipo: 'SAIDA' as const, orcamentoMensal: 1000 },
    { id: 'saas', nome: 'Ferramentas', tipo: 'SAIDA' as const, orcamentoMensal: 0 },
    { id: 'rec', nome: 'Receita', tipo: 'ENTRADA' as const, orcamentoMensal: 5000 },
  ];

  it('soma o realizado do mês por categoria do mesmo tipo', () => {
    const linhas = calcularOrcadoRealizado(
      categorias,
      [
        lancamento({ categoriaId: 'ads', valor: 700, data: '2026-11-01' }),
        lancamento({ categoriaId: 'ads', valor: 500, vencimento: '2026-11-20', status: 'PENDENTE' }),
        lancamento({ categoriaId: 'ads', valor: 100, data: '2026-11-02', status: 'CANCELADO' }),
        lancamento({ categoriaId: 'ads', valor: 100, data: '2026-10-02' }),
        lancamento({ categoriaId: 'ads', tipo: 'ENTRADA', valor: 50, data: '2026-11-02' }),
        lancamento({ categoriaId: 'saas', valor: 80, data: '2026-11-03' }),
        lancamento({ categoriaId: 'rec', tipo: 'ENTRADA', valor: 2500, data: '2026-11-03' }),
      ],
      '2026-11',
    );

    expect(linhas).toEqual([
      { categoriaId: 'rec', nome: 'Receita', tipo: 'ENTRADA', orcado: 5000, realizado: 2500, diferenca: 2500, percentual: 50 },
      { categoriaId: 'ads', nome: 'Tráfego pago', tipo: 'SAIDA', orcado: 1000, realizado: 1200, diferenca: -200, percentual: 120 },
      { categoriaId: 'saas', nome: 'Ferramentas', tipo: 'SAIDA', orcado: 0, realizado: 80, diferenca: -80, percentual: null },
    ]);
  });

  it('retorna vazio sem categorias', () => {
    expect(calcularOrcadoRealizado([], [], '2026-11')).toEqual([]);
  });
});
