import { describe, expect, it } from 'vitest';

import { calcularPontuacaoIdeia } from 'src/modules/projetos/utils/calcular-pontuacao-ideia.util';

describe('calcularPontuacaoIdeia', () => {
  it('impacto × (1 + votos) ÷ esforço', () => {
    expect(calcularPontuacaoIdeia({ impacto: 5, esforco: 1, votos: 2 })).toBe(15);
    expect(calcularPontuacaoIdeia({ impacto: 2, esforco: 4, votos: 0 })).toBe(0.5);
  });

  it('arredonda para 1 casa decimal', () => {
    expect(calcularPontuacaoIdeia({ impacto: 4, esforco: 3, votos: 0 })).toBe(1.3);
  });

  it('usa 3 para impacto/esforço vazios e 0 para votos vazios', () => {
    expect(calcularPontuacaoIdeia({})).toBe(1);
    expect(calcularPontuacaoIdeia({ impacto: null, esforco: undefined, votos: null })).toBe(1);
  });

  it('limita impacto/esforço a 1–5 e ignora votos negativos', () => {
    expect(calcularPontuacaoIdeia({ impacto: 9, esforco: 0, votos: -3 })).toBe(5);
    expect(calcularPontuacaoIdeia({ impacto: 0, esforco: 10, votos: 0 })).toBe(0.2);
  });

  it('mais votos sempre aumenta a pontuação', () => {
    const base = { impacto: 3, esforco: 3 };

    expect(calcularPontuacaoIdeia({ ...base, votos: 3 })).toBeGreaterThan(
      calcularPontuacaoIdeia({ ...base, votos: 2 }),
    );
  });
});
