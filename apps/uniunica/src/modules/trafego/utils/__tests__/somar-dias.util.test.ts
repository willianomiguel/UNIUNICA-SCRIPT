import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

describe('somarDias', () => {
  it('soma e subtrai dias atravessando meses e anos', () => {
    expect(somarDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(somarDias('2026-01-01', -1)).toBe('2025-12-31');
    expect(somarDias('2026-11-14', 0)).toBe('2026-11-14');
  });
});
