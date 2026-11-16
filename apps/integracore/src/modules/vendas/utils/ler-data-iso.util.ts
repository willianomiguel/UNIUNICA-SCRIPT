// Accepts ISO strings, Date-parsable strings and Unix timestamps (seconds or milliseconds).
export const lerDataIso = (valor: unknown): string | null => {
  let data: Date | null = null;

  if (typeof valor === 'number' && Number.isFinite(valor)) {
    data = new Date(valor < 1e12 ? valor * 1000 : valor);
  } else if (typeof valor === 'string' && valor.trim() !== '') {
    data = /^\d+$/.test(valor.trim())
      ? new Date(Number(valor) < 1e12 ? Number(valor) * 1000 : Number(valor))
      : new Date(valor);
  }

  return data !== null && !Number.isNaN(data.getTime()) ? data.toISOString() : null;
};
