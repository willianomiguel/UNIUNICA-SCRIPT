import { describe, expect, it } from 'vitest';

import { calcularSaldoAnterior } from 'src/modules/financeiro/utils/calcular-saldo-anterior.util';
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

describe('calcularSaldoAnterior', () => {
  it('soma entradas e subtrai saídas anteriores ao mês, sem cancelados', () => {
    expect(
      calcularSaldoAnterior(
        [
          lancamento({ tipo: 'ENTRADA', valor: 100, data: '2026-01-10' }),
          lancamento({ tipo: 'SAIDA', valor: 30.5, data: '2026-02-10' }),
          lancamento({ tipo: 'SAIDA', valor: 999, data: '2026-02-11', status: 'CANCELADO' }),
          lancamento({ tipo: 'ENTRADA', valor: 999, data: '2026-03-01' }),
          lancamento({ tipo: 'ENTRADA', valor: 999 }),
        ],
        '2026-03',
      ),
    ).toBe(69.5);
  });
});
