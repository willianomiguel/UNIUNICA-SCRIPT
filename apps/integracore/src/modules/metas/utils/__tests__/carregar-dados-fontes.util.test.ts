import { describe, expect, it } from 'vitest';

import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { carregarDadosFontes } from 'src/modules/metas/utils/carregar-dados-fontes.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('carregarDadosFontes', () => {
  it('carrega só os objetos das fontes usadas', async () => {
    const { cliente, chamadas } = criarClienteRestFalso({
      vendas: [{ id: 'v' }],
      metricasTrafego: [{ id: 'm' }],
    });

    expect(await carregarDadosFontes(cliente, ['MANUAL', 'FATURAMENTO_BRUTO'])).toEqual({
      vendas: [{ id: 'v' }],
      lancamentos: null,
      metricasTrafego: null,
    });
    expect(chamadas.map((chamada) => chamada.path)).toEqual(['/rest/vendas']);
  });

  it('objeto inexistente vira null sem derrubar o resto', async () => {
    const { cliente: base } = criarClienteRestFalso({ lancamentos: [{ id: 'l' }] });
    const cliente: ClienteRest = {
      ...base,
      get: async <TResponse,>(path: string, options?: { query?: Record<string, string | number | boolean | null | undefined> }) => {
        if (path.includes('metricasTrafego')) throw new Error('objeto não existe');

        return base.get<TResponse>(path, options);
      },
    };

    expect(await carregarDadosFontes(cliente, ['LEADS', 'LUCRO'])).toEqual({
      vendas: null,
      lancamentos: [{ id: 'l' }],
      metricasTrafego: null,
    });
  });
});
