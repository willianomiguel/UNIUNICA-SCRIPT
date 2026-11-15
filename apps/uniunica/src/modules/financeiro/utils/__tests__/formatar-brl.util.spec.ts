import { describe, expect, it } from 'vitest';

import { formatarBrl } from 'src/modules/financeiro/utils/formatar-brl.util';

const normalizar = (texto: string) => texto.replace(/\s/g, ' ');

describe('formatarBrl', () => {
  it('formata em reais no padrão brasileiro', () => {
    expect(normalizar(formatarBrl(1234.5))).toBe('R$ 1.234,50');
    expect(normalizar(formatarBrl(-10))).toBe('-R$ 10,00');
  });
});
