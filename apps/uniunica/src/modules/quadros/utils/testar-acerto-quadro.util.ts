import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

export const distanciaPontoSegmento = (p: PontoQuadro, a: PontoQuadro, b: PontoQuadro): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const comprimento2 = dx * dx + dy * dy;
  const t =
    comprimento2 === 0
      ? 0
      : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / comprimento2));
  const px = a[0] + t * dx - p[0];
  const py = a[1] + t * dy - p[1];

  return Math.sqrt(px * px + py * py);
};

export const pontoNaCaixa = (ponto: PontoQuadro, caixa: CaixaQuadro, folga = 0): boolean =>
  ponto[0] >= caixa.x - folga &&
  ponto[0] <= caixa.x + caixa.largura + folga &&
  ponto[1] >= caixa.y - folga &&
  ponto[1] <= caixa.y + caixa.altura + folga;

export const ALTURA_TITULO_MOLDURA = 28;

export const elementoContemPonto = (
  elemento: ElementoQuadro,
  ponto: PontoQuadro,
  tolerancia: number,
): boolean => {
  if (elemento.tipo === 'seta' || elemento.tipo === 'traco') {
    if (!pontoNaCaixa(ponto, elemento, tolerancia)) {
      return false;
    }

    for (let indice = 1; indice < elemento.pontos.length; indice++) {
      if (distanciaPontoSegmento(ponto, elemento.pontos[indice - 1], elemento.pontos[indice]) <= tolerancia) {
        return true;
      }
    }

    return false;
  }

  // Moldura só pega pelo título ou pela borda: clicar no miolo vazio seleciona por área, como nos canvas.
  if (elemento.tipo === 'moldura') {
    const naFaixaDoTitulo =
      ponto[0] >= elemento.x && ponto[0] <= elemento.x + elemento.largura && ponto[1] >= elemento.y - ALTURA_TITULO_MOLDURA && ponto[1] <= elemento.y;
    const dentroExterno = pontoNaCaixa(ponto, elemento, tolerancia);
    const dentroInterno = pontoNaCaixa(ponto, { x: elemento.x + tolerancia, y: elemento.y + tolerancia, largura: elemento.largura - tolerancia * 2, altura: elemento.altura - tolerancia * 2 });

    return naFaixaDoTitulo || (dentroExterno && !dentroInterno);
  }

  if (elemento.tipo === 'elipse') {
    const rx = elemento.largura / 2 + tolerancia;
    const ry = elemento.altura / 2 + tolerancia;
    const dx = ponto[0] - (elemento.x + elemento.largura / 2);
    const dy = ponto[1] - (elemento.y + elemento.altura / 2);

    return rx > 0 && ry > 0 && (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
  }

  return pontoNaCaixa(ponto, elemento, tolerancia);
};

// Elemento mais acima (maior z) sob o ponto; null quando clicou no vazio.
export const elementoNoPonto = (
  elementos: ElementoQuadro[],
  ponto: PontoQuadro,
  tolerancia = 6,
  filtro?: (elemento: ElementoQuadro) => boolean,
): ElementoQuadro | null => {
  let melhor: ElementoQuadro | null = null;

  for (const elemento of elementos) {
    if (filtro && !filtro(elemento)) {
      continue;
    }
    if (elementoContemPonto(elemento, ponto, tolerancia) && (melhor === null || elemento.z >= melhor.z)) {
      melhor = elemento;
    }
  }

  return melhor;
};

// Formas que podem receber a ponta de uma seta.
export const ehFormaLigavel = (elemento: ElementoQuadro): boolean =>
  elemento.tipo === 'retangulo' ||
  elemento.tipo === 'elipse' ||
  elemento.tipo === 'nota' ||
  elemento.tipo === 'texto' ||
  elemento.tipo === 'moldura';
