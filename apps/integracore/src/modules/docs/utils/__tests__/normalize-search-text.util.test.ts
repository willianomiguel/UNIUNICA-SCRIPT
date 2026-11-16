import { describe, expect, it } from 'vitest';

import { normalizeSearchText } from 'src/modules/docs/utils/normalize-search-text.util';

describe('normalizeSearchText', () => {
  it('remove acentos, caixa e espaços nas pontas', () => {
    expect(normalizeSearchText('  Ata de Reunião ÚNICA ')).toBe('ata de reuniao unica');
  });

  it('retorna vazio para string vazia', () => {
    expect(normalizeSearchText('   ')).toBe('');
  });
});
