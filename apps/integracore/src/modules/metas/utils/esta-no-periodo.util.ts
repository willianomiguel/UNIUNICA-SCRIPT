// Data (YYYY-MM-DD ou ISO) dentro de [inicio, fim], comparando só o dia.
// Limites ausentes não restringem.
export const estaNoPeriodo = (
  data: unknown,
  inicio: string | null,
  fim: string | null,
): boolean => {
  if (typeof data !== 'string' || data.length < 10) {
    return false;
  }

  const dia = data.slice(0, 10);

  return (!inicio || dia >= inicio.slice(0, 10)) && (!fim || dia <= fim.slice(0, 10));
};
