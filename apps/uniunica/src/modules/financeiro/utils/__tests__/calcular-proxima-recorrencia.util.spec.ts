import { describe, expect, it } from 'vitest';

import { calcularProximaRecorrencia } from 'src/modules/financeiro/utils/calcular-proxima-recorrencia.util';

describe('calcularProximaRecorrencia', () => {
  it('semanal soma 7 dias, inclusive virando o mês', () => {
    expect(calcularProximaRecorrencia('2026-11-27', 'SEMANAL')).toBe('2026-12-04');
  });

  it('mensal, trimestral e anual', () => {
    expect(calcularProximaRecorrencia('2026-11-15', 'MENSAL')).toBe('2026-12-15');
    expect(calcularProximaRecorrencia('2026-11-15', 'TRIMESTRAL')).toBe('2027-02-15');
    expect(calcularProximaRecorrencia('2026-11-15', 'ANUAL')).toBe('2027-11-15');
  });

  it('limita ao último dia do mês (inclusive bissexto)', () => {
    expect(calcularProximaRecorrencia('2026-01-31', 'MENSAL')).toBe('2026-02-28');
    expect(calcularProximaRecorrencia('2028-01-31', 'MENSAL')).toBe('2028-02-29');
    expect(calcularProximaRecorrencia('2028-02-29', 'ANUAL')).toBe('2029-02-28');
  });

  it('usa o dia âncora para não perder o dia original', () => {
    expect(calcularProximaRecorrencia('2026-02-28', 'MENSAL', 31)).toBe('2026-03-31');
  });

  it('aceita data-hora e rejeita entradas inválidas', () => {
    expect(calcularProximaRecorrencia('2026-05-10T12:00:00Z', 'MENSAL')).toBe('2026-06-10');
    expect(calcularProximaRecorrencia('2026-05-10', 'NENHUMA')).toBeNull();
    expect(calcularProximaRecorrencia('ontem', 'MENSAL')).toBeNull();
  });
});
