import { describe, expect, it } from 'vitest';

import { formatarCodigoTarefa } from 'src/modules/sprints/utils/formatar-codigo-tarefa.util';

describe('formatarCodigoTarefa', () => {
  it('formata o número com o prefixo', () => {
    expect(formatarCodigoTarefa(42)).toBe('UNI-42');
    expect(formatarCodigoTarefa(1)).toBe('UNI-1');
  });

  it('rejeita números inválidos', () => {
    expect(() => formatarCodigoTarefa(0)).toThrow();
    expect(() => formatarCodigoTarefa(-3)).toThrow();
    expect(() => formatarCodigoTarefa(1.5)).toThrow();
  });
});
