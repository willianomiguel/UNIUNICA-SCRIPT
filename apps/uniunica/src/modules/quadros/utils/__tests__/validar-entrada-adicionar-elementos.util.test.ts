import { describe, expect, it } from 'vitest';

import { validarEntradaAdicionarElementos } from 'src/modules/quadros/utils/validar-entrada-adicionar-elementos.util';

const ID = '3431e57a-4b54-4078-8efc-50139b62f5d8';

const erro = (elementos: unknown, quadroId: unknown = ID): string => {
  const r = validarEntradaAdicionarElementos({ quadroId, elementos });

  return r.ok ? '' : r.erro;
};

describe('validarEntradaAdicionarElementos', () => {
  it('aceita formas, setas com pontos e setas presas', () => {
    const r = validarEntradaAdicionarElementos({
      quadroId: ID,
      elementos: [
        { id: 'f1', tipo: 'retangulo', x: 0, y: 0, texto: 'Oi', cor: 'red' },
        { tipo: 'seta', pontos: [[0, 0], [10, 10]] },
        { tipo: 'seta', deId: 'f1', paraId: 'f2' },
      ],
    });

    expect(r.ok).toBe(true);
  });

  it('exige quadroId e lista não vazia', () => {
    expect(erro([{ tipo: 'nota' }], null)).toContain('quadroId');
    expect(erro([])).toContain('elementos');
  });

  it('rejeita tipo, cor, texto e números inválidos', () => {
    expect(erro([{ tipo: 'circulo' }])).toContain('Tipos permitidos');
    expect(erro([{ tipo: 'nota', cor: 'preto' }])).toContain('Cores permitidas');
    expect(erro([{ tipo: 'nota', texto: 'x'.repeat(501) }])).toContain('máximo');
    expect(erro([{ tipo: 'nota', x: 'a' }])).toContain('número');
    expect(erro([{ tipo: 'nota', largura: 0 }])).toContain('maior que zero');
  });

  it('rejeita ids duplicados e setas sem pontos nem ligação', () => {
    expect(erro([{ id: 'a', tipo: 'nota' }, { id: 'a', tipo: 'nota' }])).toContain('duplicado');
    expect(erro([{ tipo: 'seta' }])).toContain('pontos');
    expect(erro([{ tipo: 'seta', deId: 'a' }])).toContain('deId e paraId');
    expect(erro([{ tipo: 'traco' }])).toContain('pontos');
    expect(erro([{ tipo: 'seta', pontos: [[0, 0]] }])).toContain('pelo menos 2');
  });

  it('limita a quantidade por chamada', () => {
    expect(erro(Array.from({ length: 201 }, () => ({ tipo: 'nota' })))).toContain('Elementos demais');
  });
});
