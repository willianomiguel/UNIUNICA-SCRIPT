import { type AlertaCanal } from 'src/modules/avisos/types/alerta-canal';

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

// Retorna a mensagem de erro (pt-BR) ou null quando o destino é válido para o canal.
export const validateAlertaDestino = (
  canal: AlertaCanal | null,
  destino: string,
): string | null => {
  if (canal === null) {
    return 'Escolha um canal (Slack, Discord, WhatsApp ou Webhook).';
  }

  if (destino.trim() === '') {
    return 'Preencha o destino do alerta.';
  }

  if (canal === 'WHATSAPP') {
    const digits = destino.replace(/\D/g, '');

    return digits.length >= 10 && digits.length <= 15
      ? null
      : 'Para WhatsApp, informe o telefone com DDI e DDD (ex.: 5511999999999).';
  }

  return isHttpUrl(destino) ? null : 'Para este canal, o destino precisa ser uma URL http(s) de webhook.';
};
