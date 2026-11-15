import { createHmac } from 'crypto';
import { describe, expect, it } from 'vitest';

import { verificarAssinaturaMercadoPago } from 'src/modules/vendas/utils/verificar-assinatura-mercado-pago.util';

const segredo = 'segredo-mp';
const assinar = (manifesto: string) => createHmac('sha256', segredo).update(manifesto).digest('hex');

describe('verificarAssinaturaMercadoPago', () => {
  it('validates the documented manifest', () => {
    const v1 = assinar('id:123456;request-id:req-1;ts:1704908010;');

    expect(
      verificarAssinaturaMercadoPago({
        cabecalhoAssinatura: `ts=1704908010,v1=${v1}`,
        idRequisicao: 'req-1',
        idDado: '123456',
        segredo,
      }),
    ).toBe(true);
  });

  it('lowercases alphanumeric ids and omits absent parts', () => {
    const v1 = assinar('id:abc123;ts:1;');

    expect(
      verificarAssinaturaMercadoPago({ cabecalhoAssinatura: `ts=1, v1=${v1}`, idRequisicao: undefined, idDado: 'ABC123', segredo }),
    ).toBe(true);
  });

  it('rejects wrong signatures and malformed headers', () => {
    expect(
      verificarAssinaturaMercadoPago({ cabecalhoAssinatura: 'ts=1,v1=deadbeef', idRequisicao: 'r', idDado: '1', segredo }),
    ).toBe(false);
    expect(verificarAssinaturaMercadoPago({ cabecalhoAssinatura: undefined, idRequisicao: 'r', idDado: '1', segredo })).toBe(false);
    expect(verificarAssinaturaMercadoPago({ cabecalhoAssinatura: 'v1=abc', idRequisicao: 'r', idDado: '1', segredo })).toBe(false);
  });
});
