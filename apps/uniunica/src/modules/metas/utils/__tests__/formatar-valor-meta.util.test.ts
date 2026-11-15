import { describe, expect, it } from 'vitest';

import { formatarValorMeta } from 'src/modules/metas/utils/formatar-valor-meta.util';

const normalizar = (texto: string) => texto.replace(/\s/g, ' ');

describe('formatarValorMeta', () => {
  it('formata conforme a unidade', () => {
    expect(normalizar(formatarValorMeta(1500, 'REAIS'))).toBe('R$ 1.500,00');
    expect(formatarValorMeta(12.5, 'PERCENTUAL')).toBe('12,5%');
    expect(formatarValorMeta(3000, 'QUANTIDADE')).toBe('3.000');
  });

  it('mostra traço sem valor', () => {
    expect(formatarValorMeta(null, 'REAIS')).toBe('—');
  });
});
