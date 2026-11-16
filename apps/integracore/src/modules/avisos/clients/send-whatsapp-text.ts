import { postJson } from 'src/modules/avisos/clients/post-json';
import { buildWhatsappRequest } from 'src/modules/avisos/utils/build-whatsapp-request.util';
import { getWhatsappConfig } from 'src/modules/avisos/utils/get-whatsapp-config.util';

// Adaptador do provedor de WhatsApp (Evolution API, Z-API ou compatível com "send text").
export const sendWhatsappText = async (telefone: string, texto: string): Promise<void> => {
  const config = getWhatsappConfig(process.env);

  if (config === null) {
    throw new Error(
      'WhatsApp não configurado: preencha a variável WHATSAPP_API_URL (e WHATSAPP_API_TOKEN) nas configurações do app.',
    );
  }

  const request = buildWhatsappRequest(config, telefone, texto);

  await postJson(request.url, request.body, request.headers);
};
