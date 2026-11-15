import { describe, expect, it } from 'vitest';

import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';

describe('extrairRegistroResposta', () => {
  it('extrai o registro da resposta', () => {
    expect(extrairRegistroResposta({ data: { createLancamento: { id: '1', a: 2 } } })).toEqual({
      id: '1',
      a: 2,
    });
  });

  it('retorna null para respostas inesperadas', () => {
    expect(extrairRegistroResposta(null)).toBeNull();
    expect(extrairRegistroResposta({})).toBeNull();
    expect(extrairRegistroResposta({ data: { x: { semId: true } } })).toBeNull();
  });
});
