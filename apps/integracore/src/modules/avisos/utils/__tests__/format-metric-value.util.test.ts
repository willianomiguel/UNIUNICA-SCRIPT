import { describe, expect, it } from 'vitest';

import { formatMetricValue } from 'src/modules/avisos/utils/format-metric-value.util';

describe('formatMetricValue', () => {
  it('formata taxas em %, dinheiro em R$ e contagens inteiras', () => {
    expect(formatMetricValue('TAXA_CHARGEBACK', 1.234)).toBe('1,23%');
    expect(formatMetricValue('FATURAMENTO_DIA', 1234.5)).toMatch(/^R\$ 1\.234,50$/);
    expect(formatMetricValue('LANCAMENTOS_ATRASADOS', 3)).toBe('3');
    expect(formatMetricValue(null, 2.5)).toBe('2,50');
  });
});
