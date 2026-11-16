import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { conferirTamanhoConteudoQuadro } from 'src/modules/quadros/utils/conferir-tamanho-conteudo-quadro.util';
import { validarEntradaAdicionarElementos } from 'src/modules/quadros/utils/validar-entrada-adicionar-elementos.util';
import { validarEntradaRemoverElementos } from 'src/modules/quadros/utils/validar-entrada-remover-elementos.util';

const QUADRO_ID = '0e6ac026-6f4b-4f95-953a-9798a4c2adcc';

describe('limites de tamanho do quadro', () => {
  it('aceita conteúdo normal e recusa JSON gigante', () => {
    const traco = (indice: number): ElementoQuadro => ({
      id: `t${indice}`,
      tipo: 'traco',
      pontos: Array.from({ length: 2000 }, (_, ponto) => [ponto * 1.123456, ponto * 7.654321]),
      x: 0, y: 0, largura: 1, altura: 1, cor: 'gray', z: indice,
    });

    expect(conferirTamanhoConteudoQuadro({ versao: 1, elementos: [traco(1)] })).toBeNull();
    expect(
      conferirTamanhoConteudoQuadro({ versao: 1, elementos: Array.from({ length: 60 }, (_, indice) => traco(indice)) }),
    ).toMatch(/grande demais/);
  });

  it('IA não pode mandar traço com pontos demais nem ids enormes', () => {
    const pontos = Array.from({ length: 2001 }, (_, indice) => [indice, indice]);

    expect(
      validarEntradaAdicionarElementos({ quadroId: QUADRO_ID, elementos: [{ tipo: 'traco', pontos }] }),
    ).toMatchObject({ ok: false });
    expect(
      validarEntradaAdicionarElementos({ quadroId: QUADRO_ID, elementos: [{ tipo: 'nota', id: 'x'.repeat(101) }] }),
    ).toMatchObject({ ok: false });
    expect(validarEntradaRemoverElementos({ quadroId: QUADRO_ID, ids: ['x'.repeat(101)] })).toMatchObject({ ok: false });
  });
});
