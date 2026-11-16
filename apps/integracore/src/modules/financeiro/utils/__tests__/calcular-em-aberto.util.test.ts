import { describe, expect, it } from 'vitest';

import { calcularEmAberto } from 'src/modules/financeiro/utils/calcular-em-aberto.util';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

const lancamento = (dados: Partial<LancamentoResumo>): LancamentoResumo => ({
  id: 'l',
  descricao: 'x',
  tipo: 'SAIDA',
  valor: 0,
  data: null,
  vencimento: null,
  status: 'PENDENTE',
  recorrencia: 'NENHUMA',
  centroCusto: null,
  categoriaId: null,
  ...dados,
});

describe('calcularEmAberto', () => {
  it('soma pendentes e atrasados, separando entradas e saídas', () => {
    expect(
      calcularEmAberto([
        lancamento({ tipo: 'ENTRADA', valor: 100, status: 'PENDENTE' }),
        lancamento({ tipo: 'ENTRADA', valor: 50.5, status: 'ATRASADO' }),
        lancamento({ tipo: 'SAIDA', valor: 30, status: 'PENDENTE' }),
        lancamento({ tipo: 'SAIDA', valor: 20, status: 'ATRASADO' }),
      ]),
    ).toEqual({ aReceber: 150.5, aPagar: 50 });
  });

  it('ignora pagos e cancelados', () => {
    expect(
      calcularEmAberto([
        lancamento({ tipo: 'ENTRADA', valor: 100, status: 'PAGO' }),
        lancamento({ tipo: 'SAIDA', valor: 80, status: 'CANCELADO' }),
      ]),
    ).toEqual({ aReceber: 0, aPagar: 0 });
  });

  it('não acumula erro de ponto flutuante', () => {
    expect(
      calcularEmAberto([
        lancamento({ tipo: 'SAIDA', valor: 0.1 }),
        lancamento({ tipo: 'SAIDA', valor: 0.2 }),
      ]).aPagar,
    ).toBe(0.3);
  });

  it('retorna zero sem lançamentos', () => {
    expect(calcularEmAberto([])).toEqual({ aReceber: 0, aPagar: 0 });
  });
});
