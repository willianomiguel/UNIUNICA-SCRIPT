import { describe, expect, it } from 'vitest';

import { toErrorMessage } from 'src/modules/avisos/utils/to-error-message.util';

describe('toErrorMessage', () => {
  it('lê Error, string e desconhecidos', () => {
    expect(toErrorMessage(new Error('falhou'))).toBe('falhou');
    expect(toErrorMessage('texto')).toBe('texto');
    expect(toErrorMessage({})).toBe('Erro desconhecido');
  });

  it('limita a 500 caracteres', () => {
    expect(toErrorMessage('x'.repeat(800))).toHaveLength(500);
  });
});
