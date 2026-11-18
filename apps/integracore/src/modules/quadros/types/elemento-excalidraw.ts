// Elemento de uma cena do Excalidraw como fica gravado. Só tipamos o que o app lê ou escreve;
// o resto do formato passa intacto (o editor completa o que faltar ao abrir).
export type ElementoExcalidraw = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDeleted?: boolean;
  version?: number;
  versionNonce?: number;
  updated?: number;
  strokeColor?: string;
  backgroundColor?: string;
  boundElements?: { id: string; type: string }[] | null;
  containerId?: string | null;
  text?: string;
  originalText?: string;
  name?: string | null;
  points?: [number, number][];
  startBinding?: { elementId: string; [campo: string]: unknown } | null;
  endBinding?: { elementId: string; [campo: string]: unknown } | null;
  [campo: string]: unknown;
};
