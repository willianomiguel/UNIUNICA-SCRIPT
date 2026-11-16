import { describe, expect, it } from 'vitest';

import { resolverStatusVenda } from 'src/modules/vendas/utils/resolver-status-venda.util';

describe('resolverStatusVenda', () => {
  it('accepts the new status when there is none or it moves forward', () => {
    expect(resolverStatusVenda({ atual: null, novo: 'PENDENTE' })).toBe('PENDENTE');
    expect(resolverStatusVenda({ atual: 'PENDENTE', novo: 'APROVADA' })).toBe('APROVADA');
    expect(resolverStatusVenda({ atual: 'RECUSADA', novo: 'APROVADA' })).toBe('APROVADA');
    expect(resolverStatusVenda({ atual: 'APROVADA', novo: 'CHARGEBACK' })).toBe('CHARGEBACK');
    expect(resolverStatusVenda({ atual: 'FALHA', novo: 'RECUSADA' })).toBe('RECUSADA');
  });

  it('keeps a later stage when an older event arrives late', () => {
    expect(resolverStatusVenda({ atual: 'APROVADA', novo: 'PENDENTE' })).toBe('APROVADA');
    expect(resolverStatusVenda({ atual: 'REEMBOLSADA', novo: 'APROVADA' })).toBe('REEMBOLSADA');
    expect(resolverStatusVenda({ atual: 'CHARGEBACK', novo: 'REEMBOLSADA' })).toBe('CHARGEBACK');
  });

  it('applies forced transitions', () => {
    expect(resolverStatusVenda({ atual: 'CHARGEBACK', novo: 'APROVADA', forcar: true })).toBe('APROVADA');
  });
});
