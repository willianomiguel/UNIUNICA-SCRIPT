import { describe, expect, it } from 'vitest';

import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import {
  filtrarItensCofre,
  ITEM_COFRE_VAZIO,
  removerItemCofre,
  salvarItemCofre,
} from 'src/modules/cofre/utils/acoes-itens-cofre.util';
import { normalizarConteudoCofre } from 'src/modules/cofre/utils/normalizar-conteudo-cofre.util';
import { validarSenhaNovaCofre } from 'src/modules/cofre/utils/validar-senha-cofre.util';

const vazio: ConteudoCofre = { versao: 1, itens: [] };
const AGORA = '2026-11-15T12:00:00.000Z';

describe('itens do cofre', () => {
  it('cria, edita e remove um acesso', () => {
    const criado = salvarItemCofre(vazio, null, { ...ITEM_COFRE_VAZIO, nome: '  VM 1 ', senha: 'x' }, AGORA, () => 'id1');

    expect(criado.itens).toEqual([{ ...ITEM_COFRE_VAZIO, nome: 'VM 1', senha: 'x', id: 'id1', atualizadoEm: AGORA }]);

    const editado = salvarItemCofre(criado, 'id1', { ...ITEM_COFRE_VAZIO, nome: 'VM 1', senha: 'y' }, AGORA, () => 'nao');

    expect(editado.itens).toHaveLength(1);
    expect(editado.itens[0].senha).toBe('y');
    expect(removerItemCofre(editado, 'id1').itens).toEqual([]);
  });

  it('exige nome', () => {
    expect(() => salvarItemCofre(vazio, null, { ...ITEM_COFRE_VAZIO, nome: '   ' }, AGORA, () => 'a')).toThrow();
  });

  it('não edita acesso que sumiu', () => {
    expect(() => salvarItemCofre(vazio, 'fantasma', { ...ITEM_COFRE_VAZIO, nome: 'x' }, AGORA, () => 'a')).toThrow();
  });

  it('busca por nome, endereço, usuário e observação, mas nunca pela senha', () => {
    const conteudo = salvarItemCofre(
      vazio,
      null,
      { nome: 'Servidor Banco', endereco: '10.0.0.9', usuario: 'admin', senha: 'segredo', observacoes: 'Azure' },
      AGORA,
      () => 'a',
    );

    expect(filtrarItensCofre(conteudo.itens, 'banco')).toHaveLength(1);
    expect(filtrarItensCofre(conteudo.itens, '10.0.0')).toHaveLength(1);
    expect(filtrarItensCofre(conteudo.itens, 'azure')).toHaveLength(1);
    expect(filtrarItensCofre(conteudo.itens, 'segredo')).toHaveLength(0);
    expect(filtrarItensCofre(conteudo.itens, '')).toHaveLength(1);
  });

  it('normaliza conteúdo e descarta itens sem id', () => {
    expect(
      normalizarConteudoCofre({ versao: 1, itens: [{ id: 'a', nome: 'x', extra: 1 }, { nome: 'sem id' }, null] }),
    ).toEqual({
      versao: 1,
      itens: [{ id: 'a', nome: 'x', endereco: '', usuario: '', senha: '', observacoes: '', atualizadoEm: '' }],
    });
    expect(() => normalizarConteudoCofre({ versao: 2, itens: [] })).toThrow();
  });
});

describe('senha nova do cofre', () => {
  it('valida tamanho, espaços e confirmação', () => {
    expect(validarSenhaNovaCofre('curta', 'curta')).toMatch(/16/);
    expect(validarSenhaNovaCofre(' senha-longa-ok-123', ' senha-longa-ok-123')).toMatch(/espaço/);
    expect(validarSenhaNovaCofre('senha-longa-ok-123', 'senha-longa-ok-12X')).toMatch(/iguais/);
    expect(validarSenhaNovaCofre('senha-longa-ok-123', 'senha-longa-ok-123')).toBeNull();
  });
});
