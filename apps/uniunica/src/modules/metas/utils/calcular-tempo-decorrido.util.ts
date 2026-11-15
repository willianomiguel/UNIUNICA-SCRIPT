const DIA_EM_MS = 86_400_000;

// Percentual (0–100) do período [dataInicio, dataFim] já decorrido em `hoje`,
// contando o dia de hoje e o dia final. null sem datas válidas.
export const calcularTempoDecorrido = (
  dataInicio: string | null,
  dataFim: string | null,
  hoje: string,
): number | null => {
  if (!dataInicio || !dataFim) {
    return null;
  }

  const inicio = Date.parse(dataInicio.slice(0, 10));
  const fim = Date.parse(dataFim.slice(0, 10)) + DIA_EM_MS;
  const agora = Date.parse(hoje.slice(0, 10)) + DIA_EM_MS;

  if (Number.isNaN(inicio) || Number.isNaN(fim) || fim <= inicio) {
    return null;
  }

  const fracao = (agora - inicio) / (fim - inicio);

  return Math.round(Math.min(1, Math.max(0, fracao)) * 1000) / 10;
};
