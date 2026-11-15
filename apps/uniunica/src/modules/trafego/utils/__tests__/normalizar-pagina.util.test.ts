import { describe, expect, it } from 'vitest';

import { normalizarPagina } from 'src/modules/trafego/utils/normalizar-pagina.util';

describe('normalizarPagina', () => {
  it('reduz URL a domínio + caminho', () => {
    expect(normalizarPagina('https://UniUnica.com.br/Oferta/?utm_source=x#topo')).toBe(
      'uniunica.com.br/oferta',
    );
  });
  it('mantém caminhos e remove query', () => {
    expect(normalizarPagina('/oferta?x=1')).toBe('/oferta');
    expect(normalizarPagina('/')).toBe('/');
  });
  it('vazio vira null e texto longo é cortado', () => {
    expect(normalizarPagina('  ')).toBeNull();
    expect(normalizarPagina(undefined)).toBeNull();
    expect(normalizarPagina(`/${'a'.repeat(500)}`)?.length).toBe(200);
  });
});
