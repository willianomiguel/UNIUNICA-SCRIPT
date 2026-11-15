import { lerCorpoJson } from 'src/modules/trafego/utils/ler-corpo-json.util';

describe('lerCorpoJson', () => {
  it('objeto passa direto e texto JSON é lido', () => {
    expect(lerCorpoJson({ a: 1 })).toEqual({ a: 1 });
    expect(lerCorpoJson('{"a":1}')).toEqual({ a: 1 });
  });
  it('texto inválido ou vazio vira null', () => {
    expect(lerCorpoJson('não é json')).toBeNull();
    expect(lerCorpoJson(undefined)).toBeNull();
  });
});
