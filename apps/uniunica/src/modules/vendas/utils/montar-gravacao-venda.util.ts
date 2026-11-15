import { type DadosVendaRegistro } from 'src/modules/vendas/types/dados-venda-registro';
import { type VendaExistente } from 'src/modules/vendas/types/venda-existente';
import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { montarDadosVenda } from 'src/modules/vendas/utils/montar-dados-venda.util';
import { resolverStatusVenda } from 'src/modules/vendas/utils/resolver-status-venda.util';

type Gravacao =
  | { operacao: 'CRIAR'; dados: DadosVendaRegistro }
  | { operacao: 'ATUALIZAR'; id: string; dados: DadosVendaRegistro };

// Decides what to write for an incoming event, given the sale already stored (if any).
export const montarGravacaoVenda = ({
  venda,
  existente,
  recebidoEm,
}: {
  venda: VendaNormalizada;
  existente: VendaExistente | null;
  recebidoEm: string;
}): Gravacao => {
  const dados = montarDadosVenda(venda);

  if (existente === null) {
    return {
      operacao: 'CRIAR',
      dados: {
        ...dados,
        descricao: dados.descricao ?? `Venda ${venda.idExterno}`,
        dataEvento: dados.dataEvento ?? recebidoEm,
      },
    };
  }

  const status = resolverStatusVenda({
    atual: existente.status,
    novo: venda.status,
    forcar: venda.forcarStatus,
  });
  const { motivoRecusa, dataEvento, ...resto } = dados;
  const statusAceito = status === venda.status;
  const atualizarData =
    dataEvento !== undefined && (existente.dataEvento === null || status === 'APROVADA');

  return {
    operacao: 'ATUALIZAR',
    id: existente.id,
    dados: {
      ...resto,
      status,
      ...(statusAceito && motivoRecusa !== undefined ? { motivoRecusa } : {}),
      ...(atualizarData ? { dataEvento } : {}),
    },
  };
};
