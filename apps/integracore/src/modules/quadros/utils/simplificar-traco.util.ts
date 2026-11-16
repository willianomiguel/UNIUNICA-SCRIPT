import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { distanciaPontoSegmento } from 'src/modules/quadros/utils/testar-acerto-quadro.util';

// Ramer–Douglas–Peucker: tira pontos que não mudam o desenho mais que `tolerancia` pixels.
export const simplificarTraco = (pontos: PontoQuadro[], tolerancia = 1.5): PontoQuadro[] => {
  if (pontos.length <= 2) {
    return pontos.map(([x, y]) => [x, y]);
  }

  const manter = new Array<boolean>(pontos.length).fill(false);
  manter[0] = true;
  manter[pontos.length - 1] = true;
  const pilha: [number, number][] = [[0, pontos.length - 1]];

  while (pilha.length > 0) {
    const [inicio, fim] = pilha.pop() as [number, number];
    let maiorDistancia = 0;
    let indiceMaior = -1;

    for (let indice = inicio + 1; indice < fim; indice++) {
      const distancia = distanciaPontoSegmento(pontos[indice], pontos[inicio], pontos[fim]);

      if (distancia > maiorDistancia) {
        maiorDistancia = distancia;
        indiceMaior = indice;
      }
    }

    if (indiceMaior !== -1 && maiorDistancia > tolerancia) {
      manter[indiceMaior] = true;
      pilha.push([inicio, indiceMaior], [indiceMaior, fim]);
    }
  }

  return pontos
    .filter((_, indice) => manter[indice])
    .map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
};
