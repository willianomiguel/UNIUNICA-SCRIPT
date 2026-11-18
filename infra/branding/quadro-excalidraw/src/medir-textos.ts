import { FONT_FAMILY } from '@excalidraw/excalidraw';
import type { ExcalidrawElement, ExcalidrawTextElement } from '@excalidraw/excalidraw/element/types';

// Textos criados pelo app (IA e quadros convertidos) chegam com tamanho estimado e a marca customData.medirTexto.
// O Excalidraw não remede texto ao abrir e não exporta a função dele, então medimos aqui com a fonte carregada.
const PADDING = 5;

type Medir = (texto: string, fonte: string) => number;

const nomeDaFonte = (familia: number) =>
  (Object.entries(FONT_FAMILY).find(([, valor]) => valor === familia)?.[0] ?? 'Excalifont').replace(/"/g, '');

const quebrar = (texto: string, larguraMaxima: number, fonte: string, medir: Medir): string[] =>
  texto.split('\n').flatMap((paragrafo) => {
    const linhas: string[] = [];
    let atual = '';

    for (const palavra of paragrafo.split(/\s+/).filter(Boolean)) {
      const tentativa = atual === '' ? palavra : `${atual} ${palavra}`;

      if (medir(tentativa, fonte) <= larguraMaxima || atual === '') {
        atual = tentativa;
      } else {
        linhas.push(atual);
        atual = palavra;
      }
    }

    return [...linhas, atual];
  });

const marcado = (elemento: ExcalidrawElement): elemento is ExcalidrawTextElement =>
  elemento.type === 'text' && !elemento.isDeleted && elemento.customData?.medirTexto === true;

export const fontesDosTextosMarcados = (elementos: readonly ExcalidrawElement[]) =>
  [...new Set(elementos.filter(marcado).map((elemento) => `${elemento.fontSize}px ${nomeDaFonte(elemento.fontFamily)}`))];

export const medirTextosMarcados = (
  elementos: readonly ExcalidrawElement[],
  medir: Medir,
): ExcalidrawElement[] | null => {
  const porId = new Map(elementos.map((elemento) => [elemento.id, elemento]));
  const trocados = new Map<string, ExcalidrawElement>();
  const versao = <TElemento extends ExcalidrawElement>(elemento: TElemento, mudancas: Partial<TElemento>): TElemento => ({
    ...elemento,
    ...mudancas,
    version: elemento.version + 1,
    versionNonce: Math.floor(Math.random() * 2 ** 31),
    updated: Date.now(),
  });

  for (const texto of elementos.filter(marcado)) {
    const fonte = `${texto.fontSize}px ${nomeDaFonte(texto.fontFamily)}`;
    const container = texto.containerId ? porId.get(texto.containerId) : undefined;
    const ehForma = container !== undefined && container.type !== 'arrow' && container.type !== 'line';
    const elipse = container?.type === 'ellipse';
    const larguraMaxima = ehForma
      ? (elipse ? Math.round((container.width / 2) * Math.SQRT2) : container.width) - PADDING * 2
      : Infinity;
    const linhas = quebrar(texto.originalText, larguraMaxima, fonte, medir);
    const largura = Math.max(...linhas.map((linha) => medir(linha, fonte)), 1);
    const altura = linhas.length * texto.fontSize * texto.lineHeight;
    let caixa = container;

    if (ehForma && container) {
      const alturaUtil = (elipse ? Math.round((container.height / 2) * Math.SQRT2) : container.height) - PADDING * 2;

      if (altura > alturaUtil) {
        const novaAltura = elipse ? Math.ceil(((altura + PADDING * 2) * 2) / Math.SQRT2) : altura + PADDING * 2;

        caixa = versao(container, { height: novaAltura });
        trocados.set(container.id, caixa);
      }
    }

    const centro = caixa && ehForma
      ? { x: caixa.x + caixa.width / 2, y: caixa.y + caixa.height / 2 }
      : { x: texto.x + texto.width / 2, y: texto.y + texto.height / 2 };

    trocados.set(
      texto.id,
      versao(texto, {
        text: linhas.join('\n'),
        width: largura,
        height: altura,
        x: texto.containerId ? centro.x - largura / 2 : texto.x,
        y: texto.containerId ? centro.y - altura / 2 : texto.y,
        customData: undefined,
      }),
    );
  }

  return trocados.size === 0 ? null : elementos.map((elemento) => trocados.get(elemento.id) ?? elemento);
};

export const criarMedidor = (): Medir => {
  const contexto = document.createElement('canvas').getContext('2d');

  return (texto, fonte) => {
    if (!contexto) {
      return texto.length * 10;
    }

    contexto.font = fonte;

    return contexto.measureText(texto).width;
  };
};
