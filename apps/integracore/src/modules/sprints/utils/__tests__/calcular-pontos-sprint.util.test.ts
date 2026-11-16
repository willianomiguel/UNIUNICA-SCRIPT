import { describe, expect, it } from 'vitest';

import { calcularPontosSprint } from 'src/modules/sprints/utils/calcular-pontos-sprint.util';

describe('calcularPontosSprint', () => {
  it('soma totais e concluídos', () => {
    expect(
      calcularPontosSprint([
        { pontos: 3, status: 'DONE' },
        { pontos: 5, status: 'IN_PROGRESS' },
        { pontos: 2, status: 'TODO' },
        { pontos: 8, status: 'DONE' },
      ]),
    ).toEqual({ pontosTotais: 18, pontosConcluidos: 11 });
  });

  it('ignora pontos vazios ou inválidos', () => {
    expect(
      calcularPontosSprint([
        { pontos: null, status: 'DONE' },
        { status: 'TODO' },
        { pontos: -2, status: 'DONE' },
        { pontos: Number.NaN, status: 'DONE' },
      ]),
    ).toEqual({ pontosTotais: 0, pontosConcluidos: 0 });
  });

  it('lista vazia dá zero', () => {
    expect(calcularPontosSprint([])).toEqual({ pontosTotais: 0, pontosConcluidos: 0 });
  });
});
