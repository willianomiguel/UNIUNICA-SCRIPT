import { createHmac, timingSafeEqual } from 'crypto';

// Confere o cabeçalho X-Hub-Signature-256 ("sha256=<hex>") do GitHub,
// calculado com HMAC-SHA256 do corpo bruto e o segredo do webhook.
export const verificarAssinaturaGithub = ({
  corpoBruto,
  assinatura,
  segredo,
}: {
  corpoBruto: string | null | undefined;
  assinatura: string | null | undefined;
  segredo: string | null | undefined;
}): boolean => {
  if (!segredo || !assinatura || typeof corpoBruto !== 'string') {
    return false;
  }

  const esperado = `sha256=${createHmac('sha256', segredo)
    .update(corpoBruto, 'utf8')
    .digest('hex')}`;

  const recebidoBuffer = Buffer.from(assinatura.trim());
  const esperadoBuffer = Buffer.from(esperado);

  if (recebidoBuffer.length !== esperadoBuffer.length) {
    return false;
  }

  return timingSafeEqual(recebidoBuffer, esperadoBuffer);
};
