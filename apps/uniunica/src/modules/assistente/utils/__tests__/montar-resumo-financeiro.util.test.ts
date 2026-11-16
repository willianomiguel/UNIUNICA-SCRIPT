import { describe, expect, it } from 'vitest';

import { montarResumoFinanceiro } from 'src/modules/assistente/utils/montar-resumo-financeiro.util';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

const lancamento = (dados: Partial<LancamentoResumo>): LancamentoResumo => ({
  id: 'l',
  descricao: 'x',
  tipo: 'SAIDA',
  valor: 0,
  data: '2026-11-10',
  vencimento: null,
  status: 'PAGO',
  recorrencia: 'NENHUMA',
  centroCusto: null,
  categoriaId: null,
  ...dados,
});

const intervalo = { inicio: '2026-11-01', fim: '2026-11-30' };
const categorias = [{ id: 'c1', nome: 'Ferramentas', tipo: 'SAIDA' as const, orcamentoMensal: 0 }];

describe('montarResumoFinanceiro', () => {
  it('período vazio dá zeros sem erro', () => {
    const resumo = montarResumoFinanceiro({ dados: { lancamentos: [], categorias: [] }, intervalo, hoje: '2026-11-15' });

    expect(resumo).toMatchObject({
      receitasRealizadas: 0,
      despesasRealizadas: 0,
      saldoRealizado: 0,
      receitasPrevistas: 0,
      despesasPrevistas: 0,
      aReceberEmAberto: 0,
      aPagarEmAberto: 0,
      atrasadosQuantidade: 0,
      atrasadosValor: 0,
      topCategoriasDespesa: [],
      quantidadeLancamentosNoPeriodo: 0,
    });
    expect(resumo.mensagem).toContain('R$');
  });

  it('separa realizado e previsto, soma centavos sem erro e conta atrasados', () => {
    const resumo = montarResumoFinanceiro({
      dados: {
        categorias,
        lancamentos: [
          lancamento({ tipo: 'ENTRADA', valor: 0.1 }),
          lancamento({ tipo: 'ENTRADA', valor: 0.2 }),
          lancamento({ valor: 50, categoriaId: 'c1' }),
          lancamento({ valor: 30, status: 'PENDENTE', data: '2026-11-20', categoriaId: 'c1' }),
          lancamento({ valor: 999, status: 'CANCELADO' }),
          lancamento({ tipo: 'ENTRADA', valor: 100, status: 'PENDENTE', data: '2026-10-01', vencimento: '2026-10-05' }),
          lancamento({ valor: 70, status: 'ATRASADO', data: '2026-11-02' }),
        ],
      },
      intervalo,
      hoje: '2026-11-15',
    });

    expect(resumo.receitasRealizadas).toBe(0.3);
    expect(resumo.despesasRealizadas).toBe(50);
    expect(resumo.saldoRealizado).toBe(-49.7);
    expect(resumo.despesasPrevistas).toBe(150);
    expect(resumo.aReceberEmAberto).toBe(100);
    expect(resumo.aPagarEmAberto).toBe(100);
    expect(resumo.atrasadosQuantidade).toBe(2);
    expect(resumo.atrasadosAPagar).toBe(70);
    expect(resumo.atrasadosAReceber).toBe(100);
    expect(resumo.topCategoriasDespesa[0]).toMatchObject({ nome: 'Ferramentas', valor: 80 });
  });
});
