import { describe, expect, it } from 'vitest';

import { semearFinanceiro } from 'src/modules/financeiro/utils/semear-financeiro.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('semearFinanceiro', () => {
  it('cria categorias e exemplos e é idempotente', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'existente', nome: 'Impostos' }],
    });

    expect(await semearFinanceiro(cliente, '2026-11-15')).toEqual({
      categoriasCriadas: 5,
      lancamentosCriados: 8,
    });

    const copia = JSON.stringify(banco);

    expect(await semearFinanceiro(cliente, '2026-11-15')).toEqual({
      categoriasCriadas: 0,
      lancamentosCriados: 0,
    });
    expect(JSON.stringify(banco)).toBe(copia);

    const das = banco.lancamentos.find((registro) => registro.chaveIdempotencia === 'seed:financeiro:7');

    expect(das).toMatchObject({ data: '2026-11-20', categoriaId: 'existente' });
    expect(banco.lancamentos.find((registro) => registro.chaveIdempotencia === 'seed:financeiro:1')?.data).toBe(
      '2026-09-28',
    );
  });
});
