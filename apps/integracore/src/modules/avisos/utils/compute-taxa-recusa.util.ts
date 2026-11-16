const RECUSADAS = new Set(['RECUSADA', 'FALHA']);
const TENTATIVAS_CONCLUIDAS = new Set(['APROVADA', 'REEMBOLSADA', 'CHARGEBACK', 'RECUSADA', 'FALHA']);

// % de recusas/falhas sobre as tentativas de pagamento concluídas (ignora pendentes e canceladas).
export const computeTaxaRecusa = (vendas: Array<{ status?: unknown }>): number => {
  const tentativas = vendas.filter((venda) => TENTATIVAS_CONCLUIDAS.has(String(venda.status)));

  if (tentativas.length === 0) {
    return 0;
  }

  const recusadas = tentativas.filter((venda) => RECUSADAS.has(String(venda.status))).length;

  return (recusadas / tentativas.length) * 100;
};
