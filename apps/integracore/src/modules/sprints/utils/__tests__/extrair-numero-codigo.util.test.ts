import { describe, expect, it } from 'vitest';

import { extrairNumeroCodigo } from 'src/modules/sprints/utils/extrair-numero-codigo.util';

describe('extrairNumeroCodigo', () => {
  it('extrai o número de um código válido', () => {
    expect(extrairNumeroCodigo('UNI-42')).toBe(42);
    expect(extrairNumeroCodigo(' uni-7 ')).toBe(7);
  });

  it('devolve null para textos que não são código', () => {
    expect(extrairNumeroCodigo(null)).toBeNull();
    expect(extrairNumeroCodigo('')).toBeNull();
    expect(extrairNumeroCodigo('ABC-3')).toBeNull();
    expect(extrairNumeroCodigo('UNI-0')).toBeNull();
    expect(extrairNumeroCodigo('UNI-12 extra')).toBeNull();
  });
});
