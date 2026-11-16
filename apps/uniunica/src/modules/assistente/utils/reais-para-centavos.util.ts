// Reais -> centavos inteiros. O toPrecision(15) tira o ruído de ponto flutuante
// antes de arredondar (0.1 + 0.2 = 0.30000000000000004 -> 30; 1.005 -> 101).
export const reaisParaCentavos = (reais: number): number =>
  Math.round(Number((reais * 100).toPrecision(15)));
