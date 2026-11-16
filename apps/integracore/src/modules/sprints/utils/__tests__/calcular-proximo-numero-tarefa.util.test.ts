import { describe, expect, it } from 'vitest';

import { calcularProximoNumeroTarefa } from 'src/modules/sprints/utils/calcular-proximo-numero-tarefa.util';

describe('calcularProximoNumeroTarefa', () => {
  it('começa em 1 sem números existentes', () => {
    expect(calcularProximoNumeroTarefa([])).toBe(1);
    expect(calcularProximoNumeroTarefa([null, undefined])).toBe(1);
  });

  it('usa o maior número + 1', () => {
    expect(calcularProximoNumeroTarefa([3, 41, null, 7])).toBe(42);
  });

  it('ignora valores inválidos', () => {
    expect(calcularProximoNumeroTarefa([Number.NaN, -5, 0, 2])).toBe(3);
  });
});
