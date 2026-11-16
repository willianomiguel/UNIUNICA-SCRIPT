import { describe, expect, it } from 'vitest';

import { calcularStatusMeta } from 'src/modules/metas/utils/calcular-status-meta.util';

describe('calcularStatusMeta', () => {
  const inicio = '2026-11-01';
  const fim = '2026-11-10';
  const meio = '2026-11-05'; // 50% do tempo

  it('concluída quando atinge 100%', () => {
    expect(calcularStatusMeta(100, inicio, fim, '2026-12-31')).toBe('CONCLUIDA');
  });

  it('no prazo até 10 p.p. abaixo do esperado', () => {
    expect(calcularStatusMeta(55, inicio, fim, meio)).toBe('NO_PRAZO');
    expect(calcularStatusMeta(40, inicio, fim, meio)).toBe('NO_PRAZO');
  });

  it('em risco até a metade do esperado, atrasada abaixo disso', () => {
    expect(calcularStatusMeta(39, inicio, fim, meio)).toBe('EM_RISCO');
    expect(calcularStatusMeta(25, inicio, fim, meio)).toBe('EM_RISCO');
    expect(calcularStatusMeta(24, inicio, fim, meio)).toBe('ATRASADA');
  });

  it('atrasada quando o prazo venceu sem concluir', () => {
    expect(calcularStatusMeta(99, inicio, fim, '2026-11-11')).toBe('ATRASADA');
  });

  it('sem datas fica no prazo', () => {
    expect(calcularStatusMeta(0, null, null, meio)).toBe('NO_PRAZO');
  });
});
