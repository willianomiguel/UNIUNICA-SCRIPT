import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';

export const buildAlertaRule = (overrides: Partial<AlertaRule> = {}): AlertaRule => ({
  id: 'alerta-1',
  nome: 'Chargeback alto',
  ativo: true,
  metrica: 'TAXA_CHARGEBACK',
  operador: 'MAIOR_QUE',
  limite: 1,
  janelaDias: 30,
  canal: 'SLACK',
  destino: 'https://hooks.slack.com/services/T/B/X',
  mensagem: '',
  cooldownHoras: 24,
  ultimoDisparo: null,
  ...overrides,
});
