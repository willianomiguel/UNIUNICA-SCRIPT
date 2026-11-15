// Lista os meses YYYY-MM de `inicio` até `fim` (inclusive).
export const listarMeses = (inicio: string, fim: string): string[] => {
  const meses: string[] = [];
  let [ano, mes] = inicio.split('-').map(Number);
  const [anoFim, mesFim] = fim.split('-').map(Number);

  while (ano < anoFim || (ano === anoFim && mes <= mesFim)) {
    meses.push(`${ano}-${String(mes).padStart(2, '0')}`);
    mes += 1;

    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
  }

  return meses;
};
