import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

// Webhooks can arrive out of order; a later-stage status is never overwritten by an earlier one.
const ESTAGIO: Record<VendaStatus, number> = {
  PENDENTE: 0,
  RECUSADA: 1,
  FALHA: 1,
  CANCELADA: 2,
  APROVADA: 2,
  REEMBOLSADA: 3,
  CHARGEBACK: 4,
};

export const resolverStatusVenda = ({
  atual,
  novo,
  forcar,
}: {
  atual: VendaStatus | null | undefined;
  novo: VendaStatus;
  forcar?: boolean;
}): VendaStatus => {
  if (forcar === true || atual === null || atual === undefined) {
    return novo;
  }

  return ESTAGIO[novo] >= ESTAGIO[atual] ? novo : atual;
};
