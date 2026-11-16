import { describe, expect, it } from 'vitest';

import { VENDA_STATUS_OPCOES } from 'src/modules/vendas/constants/venda-status-opcoes';
import { rotuloOpcao } from 'src/modules/vendas/utils/rotulo-opcao.util';

describe('rotuloOpcao', () => {
  it('returns the option label, a placeholder for missing values, or the raw value', () => {
    expect(rotuloOpcao(VENDA_STATUS_OPCOES, 'CHARGEBACK')).toBe('Chargeback');
    expect(rotuloOpcao(VENDA_STATUS_OPCOES, 'SEM_VALOR')).toBe('Não informado');
    expect(rotuloOpcao(VENDA_STATUS_OPCOES, 'XYZ')).toBe('XYZ');
  });
});
