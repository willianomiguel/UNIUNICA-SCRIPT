import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { caixaDosPontos } from 'src/modules/quadros/utils/caixa-dos-pontos.util';

// Folga entre a ponta da seta e a borda da forma, para a ponta não sumir dentro do traço.
const FOLGA = 4;

export const centroDaCaixa = (caixa: CaixaQuadro): PontoQuadro => [
  caixa.x + caixa.largura / 2,
  caixa.y + caixa.altura / 2,
];

// Ponto da borda da forma na direção de `alvo`, saindo do centro dela.
export const pontoNaBorda = (
  forma: CaixaQuadro & { tipo?: ElementoQuadro['tipo'] },
  alvo: PontoQuadro,
): PontoQuadro => {
  const [cx, cy] = centroDaCaixa(forma);
  const dx = alvo[0] - cx;
  const dy = alvo[1] - cy;
  const meiaLargura = forma.largura / 2 + FOLGA;
  const meiaAltura = forma.altura / 2 + FOLGA;

  if ((dx === 0 && dy === 0) || meiaLargura <= 0 || meiaAltura <= 0) {
    return [cx, cy];
  }

  if (forma.tipo === 'elipse') {
    const escala = 1 / Math.sqrt((dx * dx) / (meiaLargura * meiaLargura) + (dy * dy) / (meiaAltura * meiaAltura));

    return [cx + dx * escala, cy + dy * escala];
  }

  const escala = Math.min(
    dx === 0 ? Infinity : meiaLargura / Math.abs(dx),
    dy === 0 ? Infinity : meiaAltura / Math.abs(dy),
  );

  return [cx + dx * escala, cy + dy * escala];
};

// Recalcula as pontas das setas presas (deId/paraId) depois que formas mudaram de lugar ou tamanho.
export const atualizarSetasLigadas = (elementos: ElementoQuadro[]): ElementoQuadro[] => {
  const porId = new Map(elementos.map((elemento) => [elemento.id, elemento]));

  return elementos.map((elemento) => {
    if (elemento.tipo !== 'seta' || (elemento.deId === undefined && elemento.paraId === undefined)) {
      return elemento;
    }

    const origem = elemento.deId !== undefined ? porId.get(elemento.deId) : undefined;
    const destino = elemento.paraId !== undefined ? porId.get(elemento.paraId) : undefined;
    const primeiro = elemento.pontos[0];
    const ultimo = elemento.pontos[elemento.pontos.length - 1];

    const alvoInicio = destino ? centroDaCaixa(destino) : ultimo;
    const alvoFim = origem ? centroDaCaixa(origem) : primeiro;
    const inicio = origem ? pontoNaBorda(origem, alvoInicio) : primeiro;
    const fim = destino ? pontoNaBorda(destino, alvoFim) : ultimo;
    const pontos: PontoQuadro[] = [inicio, fim];

    return { ...elemento, pontos, ...caixaDosPontos(pontos) };
  });
};
