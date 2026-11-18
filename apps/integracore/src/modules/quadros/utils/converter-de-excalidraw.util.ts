import { CORES_EXCALIDRAW } from 'src/modules/quadros/constants/cores-excalidraw.constant';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ElementoExcalidraw } from 'src/modules/quadros/types/elemento-excalidraw';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

const corDe = (elemento: ElementoExcalidraw): CorQuadro => {
  const cores = Object.entries(CORES_EXCALIDRAW) as [CorQuadro, { traco: string; fundo: string }][];
  const fundo = elemento.backgroundColor?.toLowerCase();
  const traco = elemento.strokeColor?.toLowerCase();

  return (
    cores.find(([, cor]) => fundo !== 'transparent' && cor.fundo === fundo)?.[0] ??
    cores.find(([, cor]) => cor.traco === traco)?.[0] ??
    'gray'
  );
};

const pontosAbsolutos = (elemento: ElementoExcalidraw): PontoQuadro[] => {
  const pontos = Array.isArray(elemento.points) && elemento.points.length > 0 ? elemento.points : [[0, 0]];

  return pontos.map(([x, y]): PontoQuadro => [elemento.x + x, elemento.y + y]);
};

// Visão simplificada da cena no formato antigo do quadro. Serve às ferramentas da IA (resumo, área ocupada,
// ids existentes); não é gravada. Texto preso a uma forma vira o texto da forma.
export const converterDeExcalidraw = (elementos: ElementoExcalidraw[]): ElementoQuadro[] => {
  const visiveis = elementos.filter((elemento) => !elemento.isDeleted);
  const textoPorContainer = new Map(
    visiveis
      .filter((elemento) => elemento.type === 'text' && typeof elemento.containerId === 'string')
      .map((elemento) => [elemento.containerId as string, elemento.originalText ?? elemento.text ?? '']),
  );

  return visiveis.flatMap((elemento, z): ElementoQuadro[] => {
    const comum = {
      id: elemento.id,
      x: elemento.x,
      y: elemento.y,
      largura: Math.abs(elemento.width),
      altura: Math.abs(elemento.height),
      cor: corDe(elemento),
      z,
    };
    const textoPreso = textoPorContainer.get(elemento.id) ?? '';

    switch (elemento.type) {
      case 'text':
        return typeof elemento.containerId === 'string'
          ? []
          : [{ ...comum, tipo: 'texto', texto: elemento.originalText ?? elemento.text ?? '' }];
      case 'ellipse':
        return [{ ...comum, tipo: 'elipse', texto: textoPreso }];
      case 'frame':
      case 'magicframe':
        return [{ ...comum, tipo: 'moldura', texto: elemento.name ?? '' }];
      case 'arrow':
      case 'line': {
        const deId = elemento.startBinding?.elementId;
        const paraId = elemento.endBinding?.elementId;

        return [
          {
            ...comum,
            tipo: 'seta',
            pontos: pontosAbsolutos(elemento),
            ...(deId ? { deId } : {}),
            ...(paraId ? { paraId } : {}),
            ...(textoPreso ? { texto: textoPreso } : {}),
          },
        ];
      }
      case 'freedraw':
        return [{ ...comum, tipo: 'traco', pontos: pontosAbsolutos(elemento) }];
      default:
        // rectangle, diamond, image, embeddable…: para a IA, tudo é uma caixa.
        return [{ ...comum, tipo: 'retangulo', texto: textoPreso }];
    }
  });
};
