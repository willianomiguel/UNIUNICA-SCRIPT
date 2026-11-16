import { describe, expect, it } from 'vitest';

import { mensagemDeErro } from 'src/modules/vendas/utils/mensagem-de-erro.util';

describe('mensagemDeErro', () => {
  it('extracts messages from errors, strings and objects', () => {
    expect(mensagemDeErro(new Error('falhou'))).toBe('falhou');
    expect(mensagemDeErro('texto')).toBe('texto');
    expect(mensagemDeErro({ a: 1 })).toBe('{"a":1}');
    expect(mensagemDeErro(undefined)).toBe('Erro desconhecido');
  });
});
