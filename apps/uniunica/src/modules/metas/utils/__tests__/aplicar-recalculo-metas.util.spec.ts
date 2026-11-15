import { describe, expect, it } from 'vitest';

import { aplicarRecalculoMetas } from 'src/modules/metas/utils/aplicar-recalculo-metas.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('aplicarRecalculoMetas', () => {
  it('grava as mudanças e é idempotente', async () => {
    const { cliente, banco, chamadas } = criarClienteRestFalso({
      metas: [
        {
          id: 'fat',
          titulo: 'Faturamento',
          fonte: 'FATURAMENTO_BRUTO',
          dataInicio: '2026-10-01',
          dataFim: '2026-12-31',
          valorInicial: 0,
          valorAlvo: 1000,
          valorAtual: 0,
        },
      ],
      vendas: [
        { id: 'v', status: 'APROVADA', valor: { amountMicros: 250_000_000 }, dataEvento: '2026-11-01' },
      ],
    });

    expect(await aplicarRecalculoMetas(cliente, '2026-11-15', '2026-11-15T12:00:00Z')).toEqual({
      metas: 1,
      atualizadas: 1,
    });
    expect(banco.metas[0]).toMatchObject({
      valorAtual: 250,
      progresso: 25,
      status: 'EM_RISCO',
      ultimaAtualizacao: '2026-11-15T12:00:00Z',
    });

    const escritas = chamadas.filter((chamada) => chamada.metodo === 'PATCH').length;

    expect(await aplicarRecalculoMetas(cliente, '2026-11-15')).toEqual({ metas: 1, atualizadas: 0 });
    expect(chamadas.filter((chamada) => chamada.metodo === 'PATCH').length).toBe(escritas);
  });
});
