const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const MAXIMO_DIAS = 366;

// Lista os dias (AAAA-MM-DD) de inicio até fim, inclusive. Datas inválidas
// ou fim antes do início devolvem lista vazia.
export const listarDiasEntreDatas = (
  inicio: string | null | undefined,
  fim: string | null | undefined,
): string[] => {
  if (!inicio || !fim || !DATA_ISO.test(inicio.slice(0, 10)) || !DATA_ISO.test(fim.slice(0, 10))) {
    return [];
  }

  const atual = new Date(`${inicio.slice(0, 10)}T00:00:00Z`);
  const ultimo = new Date(`${fim.slice(0, 10)}T00:00:00Z`);

  if (Number.isNaN(atual.getTime()) || Number.isNaN(ultimo.getTime())) {
    return [];
  }

  const dias: string[] = [];

  while (atual.getTime() <= ultimo.getTime() && dias.length < MAXIMO_DIAS) {
    dias.push(atual.toISOString().slice(0, 10));
    atual.setUTCDate(atual.getUTCDate() + 1);
  }

  return dias;
};
