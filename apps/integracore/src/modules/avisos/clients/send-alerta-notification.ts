import { postJson } from 'src/modules/avisos/clients/post-json';
import { sendWhatsappText } from 'src/modules/avisos/clients/send-whatsapp-text';
import { type AlertaMessageContext } from 'src/modules/avisos/types/alerta-message-context';
import { buildDiscordPayload } from 'src/modules/avisos/utils/build-discord-payload.util';
import { buildSlackPayload } from 'src/modules/avisos/utils/build-slack-payload.util';
import { buildWebhookPayload } from 'src/modules/avisos/utils/build-webhook-payload.util';
import { validateAlertaDestino } from 'src/modules/avisos/utils/validate-alerta-destino.util';

export const sendAlertaNotification = async (context: AlertaMessageContext): Promise<void> => {
  const { rule, texto } = context;
  const destinoError = validateAlertaDestino(rule.canal, rule.destino);

  if (destinoError !== null) {
    throw new Error(destinoError);
  }

  switch (rule.canal) {
    case 'SLACK':
      return postJson(rule.destino, buildSlackPayload(texto));
    case 'DISCORD':
      return postJson(rule.destino, buildDiscordPayload(texto));
    case 'WEBHOOK':
      return postJson(rule.destino, buildWebhookPayload(context));
    case 'WHATSAPP':
      return sendWhatsappText(rule.destino, texto);
    default:
      throw new Error('Canal não suportado.');
  }
};
