export type AlertaDecision =
  | { action: 'SEND' }
  | { action: 'SKIP'; reason: 'CONDICAO_NAO_ATINGIDA' | 'EM_COOLDOWN' | 'SEM_LIMITE' };
