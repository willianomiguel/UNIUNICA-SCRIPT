// Início (ms UTC) do trimestre que contém a data, deslocado em `offset` trimestres.
export const getQuarterStart = (ms: number, offset = 0): number => {
  const date = new Date(ms);
  const quarterIndex = Math.floor(date.getUTCMonth() / 3) + offset;

  return Date.UTC(date.getUTCFullYear(), quarterIndex * 3, 1);
};
