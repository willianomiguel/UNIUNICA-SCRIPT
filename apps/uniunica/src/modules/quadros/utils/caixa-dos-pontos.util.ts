import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

export const caixaDosPontos = (pontos: PontoQuadro[]): CaixaQuadro => {
  if (pontos.length === 0) {
    return { x: 0, y: 0, largura: 0, altura: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of pontos) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { x: minX, y: minY, largura: maxX - minX, altura: maxY - minY };
};
