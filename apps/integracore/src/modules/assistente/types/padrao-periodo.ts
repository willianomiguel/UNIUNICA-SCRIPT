// Como montar o período quando o usuário não informa início e/ou fim.
export type PadraoPeriodo =
  | { tipo: 'MES_COMPLETO' }
  | { tipo: 'MES_ATE_HOJE' }
  | { tipo: 'ULTIMOS_DIAS'; dias: number };
