const PADRAO_DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

// true só para AAAA-MM-DD que existe no calendário (2026-02-30 é inválida).
export const ehDataIsoValida = (valor: unknown): valor is string => {
  if (typeof valor !== 'string' || !PADRAO_DATA_ISO.test(valor)) {
    return false;
  }

  const data = new Date(`${valor}T00:00:00Z`);

  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
};
