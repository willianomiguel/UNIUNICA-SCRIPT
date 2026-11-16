import { describe, expect, it } from 'vitest';

import { validarEntradaDesenharDiagrama } from 'src/modules/quadros/utils/validar-entrada-desenhar-diagrama.util';

const ID = '3431e57a-4b54-4078-8efc-50139b62f5d8';
const base = {
  quadroId: ID,
  nos: [
    { id: 'a', texto: 'A' },
    { id: 'b', texto: 'B' },
  ],
  ligacoes: [{ de: 'a', para: 'b' }],
};

const erro = (entrada: unknown): string => {
  const r = validarEntradaDesenharDiagrama(entrada);

  return r.ok ? '' : r.erro;
};

describe('validarEntradaDesenharDiagrama', () => {
  it('aceita entrada válida e aplica padrões', () => {
    const r = validarEntradaDesenharDiagrama(base);

    expect(r).toMatchObject({ ok: true, valor: { quadroId: ID, substituir: false } });
  });

  it('exige quadroId', () => {
    expect(erro({ ...base, quadroId: undefined })).toContain('quadroId');
    expect(erro({ ...base, quadroId: 'abc' })).toContain('UUID');
    expect(erro('x')).toContain('Entrada inválida');
  });

  it('rejeita ids de nó duplicados', () => {
    expect(erro({ ...base, nos: [{ id: 'a', texto: 'A' }, { id: 'a', texto: 'B' }] })).toContain('duplicado');
  });

  it('rejeita ligação para nó desconhecido', () => {
    expect(erro({ ...base, ligacoes: [{ de: 'a', para: 'zzz' }] })).toContain('"zzz"');
  });

  it('rejeita ligação de um nó para ele mesmo', () => {
    expect(erro({ ...base, ligacoes: [{ de: 'a', para: 'a' }] })).toContain('ele mesmo');
  });

  it('limita a quantidade de nós', () => {
    const nos = Array.from({ length: 201 }, (_, i) => ({ id: `n${i}`, texto: 'x' }));

    expect(erro({ quadroId: ID, nos, ligacoes: [] })).toContain('Nós demais');
  });

  it('rejeita texto grande demais, nó sem texto e lista vazia', () => {
    expect(erro({ ...base, nos: [{ id: 'a', texto: 'x'.repeat(501) }] })).toContain('máximo é 500');
    expect(erro({ ...base, nos: [{ id: 'a', texto: ' ' }] })).toContain('sem texto');
    expect(erro({ ...base, nos: [] })).toContain('nos');
  });

  it('lista as cores permitidas quando a cor é inválida', () => {
    const mensagem = erro({ ...base, nos: [{ id: 'a', texto: 'A', cor: 'magenta' }] });

    expect(mensagem).toContain('magenta');
    expect(mensagem).toContain('turquoise');
  });

  it('valida forma, direção e substituir', () => {
    expect(erro({ ...base, nos: [{ id: 'a', texto: 'A', forma: 'estrela' }] })).toContain('Forma inválida');
    expect(erro({ ...base, direcao: 'cima' })).toContain('direcao');
    expect(erro({ ...base, substituir: 'sim' })).toContain('substituir');
    expect(validarEntradaDesenharDiagrama({ ...base, direcao: 'baixo', substituir: true })).toMatchObject({
      ok: true,
      valor: { direcao: 'baixo', substituir: true },
    });
  });
});
