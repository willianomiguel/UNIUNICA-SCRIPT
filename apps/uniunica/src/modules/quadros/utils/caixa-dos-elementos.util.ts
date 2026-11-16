import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';

// Caixa que envolve todos os elementos; null quando não há nenhum.
export const caixaDosElementos = (elementos: ElementoQuadro[]): CaixaQuadro | null => {
  if (elementos.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const elemento of elementos) {
    minX = Math.min(minX, elemento.x);
    minY = Math.min(minY, elemento.y);
    maxX = Math.max(maxX, elemento.x + elemento.largura);
    maxY = Math.max(maxY, elemento.y + elemento.altura);
  }

  return { x: minX, y: minY, largura: maxX - minX, altura: maxY - minY };
};
