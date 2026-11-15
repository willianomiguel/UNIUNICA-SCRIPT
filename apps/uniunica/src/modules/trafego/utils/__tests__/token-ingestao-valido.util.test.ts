import { describe, expect, it } from 'vitest';

import { tokenIngestaoValido } from 'src/modules/trafego/utils/token-ingestao-valido.util';

describe('tokenIngestaoValido', () => {
  it('sem token configurado recusa tudo', () => {
    expect(tokenIngestaoValido({}, undefined)).toBe(false);
    expect(tokenIngestaoValido({}, '  ')).toBe(false);
    expect(tokenIngestaoValido({ headers: { 'x-trafego-token': '' } }, '')).toBe(false);
  });
  it('com token exige cabeçalho ou query iguais', () => {
    expect(tokenIngestaoValido({ headers: { 'x-trafego-token': 'abc' } }, 'abc')).toBe(true);
    expect(tokenIngestaoValido({ queryStringParameters: { token: 'abc' } }, 'abc')).toBe(true);
    expect(tokenIngestaoValido({ headers: { 'x-trafego-token': 'errado' } }, 'abc')).toBe(false);
    expect(tokenIngestaoValido({}, 'abc')).toBe(false);
  });
});
