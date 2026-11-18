import { type ElementoExcalidraw } from 'src/modules/quadros/types/elemento-excalidraw';

// Campo `cena` do quadro: a cena do Excalidraw (ver README do módulo).
export type CenaQuadro = {
  tipo: 'excalidraw';
  versao: 1;
  elements: ElementoExcalidraw[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};
