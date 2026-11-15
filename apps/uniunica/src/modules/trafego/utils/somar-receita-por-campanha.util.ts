import { STATUS_VENDA_APROVADA } from 'src/modules/trafego/constants/trafego-constantes';
import { type ReceitaCampanha } from 'src/modules/trafego/types/receita-campanha';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';

// Soma receita e quantidade das vendas APROVADAS ligadas a cada campanha.
export const somarReceitaPorCampanha = (
  vendas: VendaResumo[],
): Record<string, ReceitaCampanha> => {
  const resultado: Record<string, ReceitaCampanha> = {};

  for (const venda of vendas) {
    if (!venda.campanhaId || venda.status !== STATUS_VENDA_APROVADA) {
      continue;
    }

    const atual = (resultado[venda.campanhaId] ??= { receita: 0, vendas: 0 });

    atual.receita += venda.valor || 0;
    atual.vendas += 1;
  }

  return resultado;
};
