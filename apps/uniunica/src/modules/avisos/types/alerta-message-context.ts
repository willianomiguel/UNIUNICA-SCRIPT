import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';

export type AlertaMessageContext = {
  rule: AlertaRule;
  valor: number;
  texto: string;
  isTest: boolean;
  avaliadoEm: string;
};
