// Progresso (0–100, 1 casa) do valor inicial até o alvo. Funciona também para
// metas de redução (alvo menor que o inicial, ex.: taxa de chargeback).
export const calcularProgressoMeta = (
  valorInicial: number | null,
  valorAlvo: number | null,
  valorAtual: number | null,
): number => {
  if (valorAlvo === null || valorAtual === null) {
    return 0;
  }

  const inicial = valorInicial ?? 0;

  if (valorAlvo === inicial) {
    return valorAtual === valorAlvo ? 100 : 0;
  }

  const progresso = ((valorAtual - inicial) / (valorAlvo - inicial)) * 100;

  return Math.round(Math.min(100, Math.max(0, progresso)) * 10) / 10;
};
