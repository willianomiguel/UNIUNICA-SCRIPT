import { describe, expect, it } from 'vitest';

import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';

describe('respostaJson', () => {
  it('serializes the body as JSON with the given status', () => {
    const resposta = respostaJson(401, { erro: 'x' });

    expect(resposta.status).toBe(401);
    expect(resposta.body).toBe('{"erro":"x"}');
    expect(resposta.headers).toEqual({ 'content-type': 'application/json' });
  });
});
