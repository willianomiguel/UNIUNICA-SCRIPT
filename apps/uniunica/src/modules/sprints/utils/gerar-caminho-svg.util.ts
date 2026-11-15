// Converte pontos (x, y) em um atributo "d" de <path> SVG.
// Valores y nulos quebram a linha (começa um novo trecho com "M").
export const gerarCaminhoSvg = (
  pontos: Array<{ x: number; y: number | null }>,
): string => {
  const partes: string[] = [];
  let desenhando = false;

  for (const { x, y } of pontos) {
    if (y === null || !Number.isFinite(y) || !Number.isFinite(x)) {
      desenhando = false;
      continue;
    }

    partes.push(`${desenhando ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
    desenhando = true;
  }

  return partes.join(' ');
};
