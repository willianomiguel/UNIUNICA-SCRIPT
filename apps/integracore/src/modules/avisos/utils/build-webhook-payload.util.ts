import { type AlertaMessageContext } from 'src/modules/avisos/types/alerta-message-context';

// JSON genérico com a mensagem pronta e os dados da regra, para integrações próprias (n8n, Make, Zapier…).
export const buildWebhookPayload = ({
  rule,
  valor,
  texto,
  isTest,
  avaliadoEm,
}: AlertaMessageContext): Record<string, unknown> => ({
  evento: isTest ? 'alerta.teste' : 'alerta.disparado',
  texto,
  alerta: {
    id: rule.id,
    nome: rule.nome,
    metrica: rule.metrica,
    operador: rule.operador,
    limite: rule.limite,
    janelaDias: rule.janelaDias,
  },
  valor,
  avaliadoEm,
});
