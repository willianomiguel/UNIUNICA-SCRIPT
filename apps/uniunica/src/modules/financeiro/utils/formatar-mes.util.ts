const MESES = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

// "2026-11" → "nov/2026"
export const formatarMes = (mes: string): string => {
  const [ano, numero] = mes.split('-').map(Number);

  return `${MESES[numero - 1] ?? '?'}/${ano}`;
};
