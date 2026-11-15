import { describe, expect, it } from 'vitest';

import { calcularFluxoCaixaMensal } from 'src/modules/financeiro/utils/calcular-fluxo-caixa-mensal.util';
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

describe('calcularFluxoCaixaMensal', () => {
  const lancamentos = [
    lancamento({ tipo: 'ENTRADA', valor: 1000, data: '2026-01-10' }),
    lancamento({ tipo: 'SAIDA', valor: 300.1, data: '2026-01-15' }),
    lancamento({ tipo: 'SAIDA', valor: 200.2, vencimento: '2026-03-05', status: 'PENDENTE' }),
    lancamento({ tipo: 'ENTRADA', valor: 999, data: '2026-03-01', status: 'CANCELADO' }),
    lancamento({ tipo: 'ENTRADA', valor: 50, data: '2025-12-31' }),
  ];

  it('agrupa por mês, preenche meses vazios e acumula o saldo', () => {
    expect(calcularFluxoCaixaMensal(lancamentos, '2026-01', '2026-03', 50)).toEqual([
      { mes: '2026-01', entradas: 1000, saidas: 300.1, saldo: 699.9, saldoAcumulado: 749.9 },
      { mes: '2026-02', entradas: 0, saidas: 0, saldo: 0, saldoAcumulado: 749.9 },
      { mes: '2026-03', entradas: 0, saidas: 200.2, saldo: -200.2, saldoAcumulado: 549.7 },
    ]);
  });

  it('retorna meses zerados sem lançamentos', () => {
    expect(calcularFluxoCaixaMensal([], '2026-01', '2026-01')).toEqual([
      { mes: '2026-01', entradas: 0, saidas: 0, saldo: 0, saldoAcumulado: 0 },
    ]);
  });
});
