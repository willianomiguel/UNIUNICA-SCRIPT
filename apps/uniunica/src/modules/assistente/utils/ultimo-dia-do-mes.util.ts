// "2026-02-10" -> "2026-02-28"
export const ultimoDiaDoMes = (data: string): string => {
  const ano = Number(data.slice(0, 4));
  const mes = Number(data.slice(5, 7));

  return new Date(Date.UTC(ano, mes, 0)).toISOString().slice(0, 10);
};
