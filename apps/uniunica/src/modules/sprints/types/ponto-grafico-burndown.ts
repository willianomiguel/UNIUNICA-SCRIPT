// Um dia do gráfico de burndown: linha ideal e linha real (null = sem foto).
export type PontoGraficoBurndown = {
  data: string;
  ideal: number;
  real: number | null;
};
