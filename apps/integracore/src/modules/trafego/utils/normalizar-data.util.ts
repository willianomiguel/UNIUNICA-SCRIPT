// Aceita "AAAA-MM-DD", ISO com hora ou "DD/MM/AAAA" e devolve "AAAA-MM-DD" (ou null se inválida).
export const normalizarData = (valor: unknown): string | null => {
  if (typeof valor !== 'string') {
    return null;
  }

  const texto = valor.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);

  const [ano, mes, dia] = iso
    ? [iso[1], iso[2], iso[3]]
    : br
      ? [br[3], br[2], br[1]]
      : [];

  if (!ano || !mes || !dia) {
    return null;
  }

  const data = new Date(`${ano}-${mes}-${dia}T00:00:00Z`);

  if (
    Number.isNaN(data.getTime()) ||
    data.getUTCMonth() + 1 !== Number(mes) ||
    data.getUTCDate() !== Number(dia)
  ) {
    return null;
  }

  return `${ano}-${mes}-${dia}`;
};
