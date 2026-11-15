import { createHmac } from 'crypto';
import { describe, expect, it } from 'vitest';

import { verificarAssinaturaStripe } from 'src/modules/vendas/utils/verificar-assinatura-stripe.util';

const segredo = 'whsec_teste';
const corpoBruto = '{"id":"evt_1","type":"payment_intent.succeeded"}';
const t = 1_763_000_000;
const assinar = (timestamp: number, corpo: string, chave = segredo) =>
  createHmac('sha256', chave).update(`${timestamp}.${corpo}`).digest('hex');

describe('verificarAssinaturaStripe', () => {
  it('accepts a valid signature, including among several v1 values', () => {
    expect(
      verificarAssinaturaStripe({ corpoBruto, cabecalho: `t=${t},v1=${assinar(t, corpoBruto)}`, segredo, agoraSegundos: t + 10 }),
    ).toBe(true);
    expect(
      verificarAssinaturaStripe({
        corpoBruto,
        cabecalho: `t=${t},v1=${'0'.repeat(64)},v1=${assinar(t, corpoBruto)},v0=abc`,
        segredo,
        agoraSegundos: t,
      }),
    ).toBe(true);
  });

  it('rejects tampered bodies, wrong secrets and stale timestamps', () => {
    const cabecalho = `t=${t},v1=${assinar(t, corpoBruto)}`;

    expect(verificarAssinaturaStripe({ corpoBruto: `${corpoBruto} `, cabecalho, segredo, agoraSegundos: t })).toBe(false);
    expect(verificarAssinaturaStripe({ corpoBruto, cabecalho, segredo: 'outro', agoraSegundos: t })).toBe(false);
    expect(verificarAssinaturaStripe({ corpoBruto, cabecalho, segredo, agoraSegundos: t + 301 })).toBe(false);
  });

  it('rejects missing or malformed headers', () => {
    expect(verificarAssinaturaStripe({ corpoBruto, cabecalho: undefined, segredo, agoraSegundos: t })).toBe(false);
    expect(verificarAssinaturaStripe({ corpoBruto, cabecalho: 'v1=abc', segredo, agoraSegundos: t })).toBe(false);
    expect(verificarAssinaturaStripe({ corpoBruto, cabecalho: `t=${t}`, segredo, agoraSegundos: t })).toBe(false);
  });
});
