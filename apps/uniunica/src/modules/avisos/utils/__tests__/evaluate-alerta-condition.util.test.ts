import { describe, expect, it } from 'vitest';

import { evaluateAlertaCondition } from 'src/modules/avisos/utils/evaluate-alerta-condition.util';

describe('evaluateAlertaCondition', () => {
  it('MAIOR_QUE é estrito', () => {
    expect(evaluateAlertaCondition('MAIOR_QUE', 1.01, 1)).toBe(true);
    expect(evaluateAlertaCondition('MAIOR_QUE', 1, 1)).toBe(false);
  });

  it('MENOR_QUE é estrito', () => {
    expect(evaluateAlertaCondition('MENOR_QUE', 999, 1000)).toBe(true);
    expect(evaluateAlertaCondition('MENOR_QUE', 1000, 1000)).toBe(false);
  });
});
