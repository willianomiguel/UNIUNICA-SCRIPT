import { CATEGORIA_RECEITA_VENDAS } from 'src/modules/financeiro/constants/categoria-receita-vendas';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type VendaResumo } from 'src/modules/financeiro/types/venda-resumo';
import { buscarCategoriaPorNome } from 'src/modules/financeiro/utils/buscar-categoria-por-nome.util';
import { existeLancamentoComChave } from 'src/modules/financeiro/utils/existe-lancamento-com-chave.util';
import { montarLancamentoVenda } from 'src/modules/financeiro/utils/montar-lancamento-venda.util';

type ResultadoSincronizacao =
  | 'CRIADO'
  | 'JA_EXISTE'
  | 'SEM_LANCAMENTO'
  | 'SEM_ENTRADA_ORIGINAL';

// Cria o lançamento correspondente ao status da venda, se ainda não existir.
// Estornos só são lançados quando a entrada da venda foi registrada antes.
// Entradas vão para a categoria "Receita de vendas", se existir.
export const sincronizarLancamentoVenda = async (
  cliente: ClienteRest,
  venda: VendaResumo,
  hoje: string,
): Promise<ResultadoSincronizacao> => {
  const payload = montarLancamentoVenda(venda, hoje);

  if (payload === null) {
    return 'SEM_LANCAMENTO';
  }

  if (await existeLancamentoComChave(cliente, payload.chaveIdempotencia)) {
    return 'JA_EXISTE';
  }

  if (
    payload.tipo === 'SAIDA' &&
    !(await existeLancamentoComChave(cliente, `venda:${venda.id}:entrada`))
  ) {
    return 'SEM_ENTRADA_ORIGINAL';
  }

  const categoriaId =
    payload.tipo === 'ENTRADA'
      ? await buscarCategoriaPorNome(cliente, CATEGORIA_RECEITA_VENDAS)
      : null;

  await cliente.post('/rest/lancamentos', { ...payload, categoriaId });

  return 'CRIADO';
};
