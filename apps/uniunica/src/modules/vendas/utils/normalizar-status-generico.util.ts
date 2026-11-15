import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

const MAPA: Record<string, VendaStatus> = {
  aprovada: 'APROVADA',
  aprovado: 'APROVADA',
  paga: 'APROVADA',
  pago: 'APROVADA',
  approved: 'APROVADA',
  paid: 'APROVADA',
  succeeded: 'APROVADA',
  pendente: 'PENDENTE',
  pending: 'PENDENTE',
  aguardando_pagamento: 'PENDENTE',
  recusada: 'RECUSADA',
  recusado: 'RECUSADA',
  refused: 'RECUSADA',
  declined: 'RECUSADA',
  rejected: 'RECUSADA',
  falha: 'FALHA',
  failed: 'FALHA',
  erro: 'FALHA',
  reembolsada: 'REEMBOLSADA',
  reembolsado: 'REEMBOLSADA',
  estornada: 'REEMBOLSADA',
  estornado: 'REEMBOLSADA',
  refunded: 'REEMBOLSADA',
  chargeback: 'CHARGEBACK',
  disputed: 'CHARGEBACK',
  contestada: 'CHARGEBACK',
  cancelada: 'CANCELADA',
  cancelado: 'CANCELADA',
  canceled: 'CANCELADA',
  cancelled: 'CANCELADA',
};

export const normalizarStatusGenerico = (
  valor: string | null,
): VendaStatus | null =>
  valor === null ? null : (MAPA[valor.trim().toLowerCase().replace(/[\s-]/g, '_')] ?? null);
