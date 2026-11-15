import { createHmac } from 'crypto';

import { compararSegredo } from 'src/modules/vendas/utils/comparar-segredo.util';

// x-signature: "ts=<ts>,v1=<hex>", signed manifest "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
// (Mercado Pago lowercases alphanumeric ids; parts that are absent are omitted from the manifest).
export const verificarAssinaturaMercadoPago = ({
  cabecalhoAssinatura,
  idRequisicao,
  idDado,
  segredo,
}: {
  cabecalhoAssinatura: string | undefined;
  idRequisicao: string | undefined;
  idDado: string | null;
  segredo: string;
}): boolean => {
  if (!cabecalhoAssinatura) {
    return false;
  }

  const partes = Object.fromEntries(
    cabecalhoAssinatura.split(',').map((parte) => {
      const [chave, ...valor] = parte.trim().split('=');

      return [chave, valor.join('=')];
    }),
  );
  const ts = partes.ts;
  const v1 = partes.v1;

  if (!ts || !v1) {
    return false;
  }

  const manifesto = [
    idDado ? `id:${/^[a-z0-9]+$/i.test(idDado) ? idDado.toLowerCase() : idDado};` : '',
    idRequisicao ? `request-id:${idRequisicao};` : '',
    `ts:${ts};`,
  ].join('');
  const esperada = createHmac('sha256', segredo).update(manifesto).digest('hex');

  return compararSegredo(v1, esperada);
};
