import { type AlertaDecision } from 'src/modules/avisos/types/alerta-decision';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';
import { evaluateAlertaCondition } from 'src/modules/avisos/utils/evaluate-alerta-condition.util';
import { isAlertaInCooldown } from 'src/modules/avisos/utils/is-alerta-in-cooldown.util';

export const decideAlertaAction = (
  rule: Pick<AlertaRule, 'operador' | 'limite' | 'ultimoDisparo' | 'cooldownHoras'>,
  valor: number,
  now: Date,
): AlertaDecision => {
  if (rule.limite === null) {
    return { action: 'SKIP', reason: 'SEM_LIMITE' };
  }

  if (!evaluateAlertaCondition(rule.operador, valor, rule.limite)) {
    return { action: 'SKIP', reason: 'CONDICAO_NAO_ATINGIDA' };
  }

  if (isAlertaInCooldown(rule.ultimoDisparo, rule.cooldownHoras, now)) {
    return { action: 'SKIP', reason: 'EM_COOLDOWN' };
  }

  return { action: 'SEND' };
};
