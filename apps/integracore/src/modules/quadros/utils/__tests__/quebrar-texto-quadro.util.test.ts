import { describe, expect, it } from 'vitest';

import { quebrarTextoQuadro } from 'src/modules/quadros/utils/quebrar-texto-quadro.util';

describe('quebrarTextoQuadro (editor)', () => {
  it('quebra por palavra conforme a largura', () => {
    // 14px × 0,56 ≈ 7,84px por caractere → 100px cabem 12 caracteres.
    expect(quebrarTextoQuadro('Receber pedido do cliente', 100, 14)).toEqual(['Receber', 'pedido do', 'cliente']);
  });

  it('respeita quebras de linha e parte palavras enormes', () => {
    expect(quebrarTextoQuadro('a\nb', 100, 14)).toEqual(['a', 'b']);
    expect(quebrarTextoQuadro('x'.repeat(30), 100, 14)).toEqual(['x'.repeat(12), 'x'.repeat(12), 'x'.repeat(6)]);
  });

  it('corta com reticências quando passa do máximo de linhas', () => {
    expect(quebrarTextoQuadro('um dois tres quatro', 40, 14, 2)).toEqual(['um', 'dois…']);
  });
});
