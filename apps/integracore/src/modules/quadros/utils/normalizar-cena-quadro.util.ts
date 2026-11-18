import { type CenaQuadro } from 'src/modules/quadros/types/cena-quadro';
import { type ElementoExcalidraw } from 'src/modules/quadros/types/elemento-excalidraw';

const ehObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

const ehElemento = (valor: unknown): valor is ElementoExcalidraw =>
  ehObjeto(valor) &&
  typeof valor.id === 'string' &&
  typeof valor.type === 'string' &&
  Number.isFinite(valor.x) &&
  Number.isFinite(valor.y) &&
  Number.isFinite(valor.width) &&
  Number.isFinite(valor.height);

// null quando o campo ainda não tem cena do Excalidraw (quadro antigo ou novo); descarta elementos quebrados.
export const normalizarCenaQuadro = (bruto: unknown): CenaQuadro | null => {
  if (!ehObjeto(bruto) || bruto.tipo !== 'excalidraw' || !Array.isArray(bruto.elements)) {
    return null;
  }

  return {
    tipo: 'excalidraw',
    versao: 1,
    elements: bruto.elements.filter(ehElemento),
    appState: ehObjeto(bruto.appState) ? bruto.appState : {},
    files: ehObjeto(bruto.files) ? bruto.files : {},
  };
};

export const CENA_VAZIA: CenaQuadro = { tipo: 'excalidraw', versao: 1, elements: [], appState: {}, files: {} };
