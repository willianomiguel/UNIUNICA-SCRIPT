// "2026-11-05" -> "05/11/2026"
export const formatarDataBr = (dataIso: string): string => {
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-');

  return `${dia}/${mes}/${ano}`;
};
