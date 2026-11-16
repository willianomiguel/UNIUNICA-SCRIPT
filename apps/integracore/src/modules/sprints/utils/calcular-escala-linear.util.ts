// Cria uma função que leva valores do domínio [d0, d1] para a faixa [r0, r1].
export const calcularEscalaLinear = (
  [d0, d1]: [number, number],
  [r0, r1]: [number, number],
): ((valor: number) => number) => {
  if (d0 === d1) {
    return () => (r0 + r1) / 2;
  }

  return (valor: number) => r0 + ((valor - d0) / (d1 - d0)) * (r1 - r0);
};
