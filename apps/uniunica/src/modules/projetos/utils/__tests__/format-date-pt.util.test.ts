import { describe, expect, it } from 'vitest';

import { formatDatePt } from 'src/modules/projetos/utils/format-date-pt.util';

describe('formatDatePt', () => {
  it('formata ms e AAAA-MM-DD', () => {
    expect(formatDatePt(Date.UTC(2026, 10, 15))).toBe('15 nov 2026');
    expect(formatDatePt('2027-01-03')).toBe('3 jan 2027');
  });

  it('vazio ou inválido vira travessão', () => {
    expect(formatDatePt(null)).toBe('—');
    expect(formatDatePt('abc')).toBe('—');
    expect(formatDatePt(Number.NaN)).toBe('—');
  });
});
