const APROVADAS_ALGUM_DIA = new Set(['APROVADA', 'REEMBOLSADA', 'CHARGEBACK']);

// % de chargebacks sobre as vendas que chegaram a ser aprovadas (aprovadas + reembolsadas + chargeback).
export const computeTaxaChargeback = (vendas: Array<{ status?: unknown }>): number => {
  const aprovadas = vendas.filter((venda) => APROVADAS_ALGUM_DIA.has(String(venda.status)));

  if (aprovadas.length === 0) {
    return 0;
  }

  const chargebacks = aprovadas.filter((venda) => venda.status === 'CHARGEBACK').length;

  return (chargebacks / aprovadas.length) * 100;
};
