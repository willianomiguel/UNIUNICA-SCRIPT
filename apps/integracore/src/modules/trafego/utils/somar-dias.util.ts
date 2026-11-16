// Soma (ou subtrai) dias de uma data "AAAA-MM-DD".
export const somarDias = (data: string, dias: number): string => {
  const base = new Date(`${data}T00:00:00Z`);

  base.setUTCDate(base.getUTCDate() + dias);

  return base.toISOString().slice(0, 10);
};
