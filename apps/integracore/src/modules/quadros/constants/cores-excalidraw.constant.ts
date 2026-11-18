import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';

// Cores do quadro na paleta padrão do Excalidraw: traço forte e fundo claro de cada tom.
export const CORES_EXCALIDRAW: Record<CorQuadro, { traco: string; fundo: string }> = {
  gray: { traco: '#1e1e1e', fundo: '#e9ecef' },
  blue: { traco: '#1971c2', fundo: '#a5d8ff' },
  turquoise: { traco: '#0c8599', fundo: '#99e9f2' },
  green: { traco: '#2f9e44', fundo: '#b2f2bb' },
  yellow: { traco: '#f08c00', fundo: '#ffec99' },
  orange: { traco: '#e8590c', fundo: '#ffd8a8' },
  red: { traco: '#e03131', fundo: '#ffc9c9' },
  pink: { traco: '#c2255c', fundo: '#fcc2d7' },
  purple: { traco: '#6741d9', fundo: '#d0bfff' },
};
