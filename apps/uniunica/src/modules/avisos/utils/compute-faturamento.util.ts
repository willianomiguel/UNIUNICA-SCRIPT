import { currencyToNumber } from 'src/modules/avisos/utils/currency-to-number.util';

// Soma do valor das vendas aprovadas (reembolsos e chargebacks não contam).
export const computeFaturamento = (
  vendas: Array<{ status?: unknown; valor?: unknown }>,
): number =>
  vendas
    .filter((venda) => venda.status === 'APROVADA')
    .reduce((total, venda) => total + currencyToNumber(venda.valor), 0);
