import { describe, expect, it } from 'vitest';

import { validarEntradaLerQuadro } from 'src/modules/quadros/utils/validar-entrada-ler-quadro.util';
import { validarEntradaRemoverElementos } from 'src/modules/quadros/utils/validar-entrada-remover-elementos.util';

const ID = '3431e57a-4b54-4078-8efc-50139b62f5d8';

describe('validarEntradaLerQuadro', () => {
  it('aceita um quadroId e rejeita ausência', () => {
    expect(validarEntradaLerQuadro({ quadroId: ID })).toEqual({ ok: true, valor: { quadroId: ID } });
    expect(validarEntradaLerQuadro({})).toMatchObject({ ok: false });
    expect(validarEntradaLerQuadro(null)).toMatchObject({ ok: false });
  });
});

describe('validarEntradaRemoverElementos', () => {
  it('deduplica ids', () => {
    expect(validarEntradaRemoverElementos({ quadroId: ID, ids: ['a', 'a', 'b'] })).toEqual({
      ok: true,
      valor: { quadroId: ID, ids: ['a', 'b'] },
    });
  });

  it('rejeita lista vazia, ids inválidos e excesso', () => {
    expect(validarEntradaRemoverElementos({ quadroId: ID, ids: [] })).toMatchObject({ ok: false });
    expect(validarEntradaRemoverElementos({ quadroId: ID, ids: [1] })).toMatchObject({ ok: false });
    expect(
      validarEntradaRemoverElementos({ quadroId: ID, ids: Array.from({ length: 501 }, (_, i) => `i${i}`) }),
    ).toMatchObject({ ok: false });
    expect(validarEntradaRemoverElementos({ ids: ['a'] })).toMatchObject({ ok: false });
  });
});
