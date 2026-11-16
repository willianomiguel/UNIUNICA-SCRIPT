import { describe, expect, it } from 'vitest';

import { interpretarPlanoIa } from 'src/modules/quadros/utils/plano-ia-quadro.util';
import { validarEntradaDesenharDiagrama } from 'src/modules/quadros/utils/validar-entrada-desenhar-diagrama.util';

const QUADRO_ID = 'dc18d6f3-bc9d-4749-9a21-1e8f6efe5521';

describe('interpretarPlanoIa', () => {
  it('converte o plano da IA num diagrama que passa na validação', () => {
    const plano = interpretarPlanoIa({
      resposta: 'Desenhei o fluxo.',
      desenhar: true,
      substituir: false,
      direcao: 'direita',
      nos: [
        { id: 'a', texto: 'Lead', forma: 'elipse', cor: 'green' },
        { id: 'b', texto: '**Proposta**\nEnviar valores', forma: 'retangulo', cor: 'blue' },
      ],
      ligacoes: [{ de: 'a', para: 'b', texto: '' }],
    });

    expect(plano?.resposta).toBe('Desenhei o fluxo.');
    expect(plano?.diagrama?.ligacoes).toEqual([{ de: 'a', para: 'b' }]);
    expect(validarEntradaDesenharDiagrama({ quadroId: QUADRO_ID, ...plano?.diagrama })).toMatchObject({ ok: true });
  });

  it('sem pedido de desenho devolve só a resposta', () => {
    expect(interpretarPlanoIa({ resposta: 'Oi!', desenhar: false, nos: [], ligacoes: [] })).toEqual({
      resposta: 'Oi!',
      diagrama: null,
    });
  });

  it('formato inesperado vira null', () => {
    expect(interpretarPlanoIa('texto solto')).toBeNull();
    expect(interpretarPlanoIa(null)).toBeNull();
  });
});

describe('interpretarPlanoIa com diagrama em texto JSON', () => {
  it('lê o campo diagrama quando vem como string JSON (formato aceito pela IA do Twenty)', () => {
    const plano = interpretarPlanoIa({
      resposta: 'Feito.',
      desenhar: true,
      diagrama: JSON.stringify({
        direcao: 'baixo',
        substituir: false,
        nos: [{ id: 'a', texto: 'A', forma: 'retangulo', cor: 'blue' }],
        ligacoes: [],
      }),
    });

    expect(plano?.diagrama?.direcao).toBe('baixo');
    expect(plano?.diagrama?.nos).toHaveLength(1);
  });

  it('diagrama com JSON quebrado não desenha', () => {
    expect(interpretarPlanoIa({ resposta: 'x', desenhar: true, diagrama: '{quebrado' })?.diagrama).toBeNull();
  });
});
