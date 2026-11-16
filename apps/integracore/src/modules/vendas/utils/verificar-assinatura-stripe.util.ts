import { createHmac } from 'crypto';

import { compararSegredo } from 'src/modules/vendas/utils/comparar-segredo.util';

const TOLERANCIA_SEGUNDOS = 300;

// Stripe-Signature: "t=<unix>,v1=<hex hmac-sha256 of `${t}.${rawBody}`>" (several v1 allowed during secret rotation).
export const verificarAssinaturaStripe = ({
  corpoBruto,
  cabecalho,
  segredo,
  agoraSegundos,
}: {
  corpoBruto: string;
  cabecalho: string | undefined;
  segredo: string;
  agoraSegundos: number;
}): boolean => {
  if (!cabecalho) {
    return false;
  }

  const partes = cabecalho.split(',').map((parte) => parte.trim().split('='));
  const timestamp = partes.find(([chave]) => chave === 't')?.[1];
  const assinaturas = partes
    .filter(([chave]) => chave === 'v1')
    .map(([, valor]) => valor);

  if (!timestamp || assinaturas.length === 0) {
    return false;
  }

  if (Math.abs(agoraSegundos - Number(timestamp)) > TOLERANCIA_SEGUNDOS) {
    return false;
  }

  const esperada = createHmac('sha256', segredo)
    .update(`${timestamp}.${corpoBruto}`)
    .digest('hex');

  return assinaturas.some((assinatura) => compararSegredo(assinatura, esperada));
};
