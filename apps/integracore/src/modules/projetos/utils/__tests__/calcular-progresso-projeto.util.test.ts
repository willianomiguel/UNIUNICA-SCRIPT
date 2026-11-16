import { describe, expect, it } from 'vitest';

import { calcularProgressoProjeto } from 'src/modules/projetos/utils/calcular-progresso-projeto.util';

describe('calcularProgressoProjeto', () => {
  it('percentual de tarefas DONE, arredondado', () => {
    expect(calcularProgressoProjeto(['DONE', 'TODO', 'IN_PROGRESS'])).toBe(33);
    expect(calcularProgressoProjeto(['DONE', 'DONE'])).toBe(100);
    expect(calcularProgressoProjeto(['TODO', null])).toBe(0);
  });

  it('sem tarefas devolve null', () => {
    expect(calcularProgressoProjeto([])).toBeNull();
  });
});
