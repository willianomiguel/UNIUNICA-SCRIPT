import { type AlertaOperador } from 'src/modules/avisos/types/alerta-operador';

export const evaluateAlertaCondition = (
  operador: AlertaOperador,
  valor: number,
  limite: number,
): boolean => (operador === 'MENOR_QUE' ? valor < limite : valor > limite);
