import { tokenIngestaoValido } from 'src/modules/trafego/utils/token-ingestao-valido.util';

describe('tokenIngestaoValido', () => {
  it('sem token configurado aceita tudo', () => {
    expect(tokenIngestaoValido({}, undefined)).toBe(true);
    expect(tokenIngestaoValido({}, '  ')).toBe(true);
  });
  it('com token exige cabeçalho ou query iguais', () => {
    expect(tokenIngestaoValido({ headers: { 'x-trafego-token': 'abc' } }, 'abc')).toBe(true);
    expect(tokenIngestaoValido({ queryStringParameters: { token: 'abc' } }, 'abc')).toBe(true);
    expect(tokenIngestaoValido({ headers: { 'x-trafego-token': 'errado' } }, 'abc')).toBe(false);
    expect(tokenIngestaoValido({}, 'abc')).toBe(false);
  });
});
