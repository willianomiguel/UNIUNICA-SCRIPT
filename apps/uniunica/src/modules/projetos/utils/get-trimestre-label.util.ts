// Rótulo do trimestre no formato usado no campo `trimestre`: '2026-T4'.
export const getTrimestreLabel = (ms: number): string => {
  const date = new Date(ms);

  return `${date.getUTCFullYear()}-T${Math.floor(date.getUTCMonth() / 3) + 1}`;
};
