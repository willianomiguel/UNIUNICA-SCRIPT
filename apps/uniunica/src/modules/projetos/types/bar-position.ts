// Posição horizontal de uma barra/marcador, em % da largura da linha do tempo.
export type BarPosition = {
  leftPercent: number;
  widthPercent: number;
  // A barra começa antes ou termina depois do intervalo visível.
  isClippedStart: boolean;
  isClippedEnd: boolean;
};
