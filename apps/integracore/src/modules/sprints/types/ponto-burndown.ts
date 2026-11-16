// Foto diária do progresso de uma sprint, guardada em sprint.historicoBurndown.
export type PontoBurndown = {
  data: string; // AAAA-MM-DD
  pontosRestantes: number;
  pontosTotais: number;
};
