import { describe, expect, it } from 'vitest';

import { decidirSincronizacaoQuadro } from 'src/modules/quadros/utils/decidir-sincronizacao-quadro.util';

const base = {
  updatedAtServidor: '2026-11-15T10:00:01Z',
  updatedAtConhecido: '2026-11-15T10:00:00Z',
  temEdicaoPendente: false,
  interagindo: false,
};

describe('decidirSincronizacaoQuadro', () => {
  it('sem edição pendente, recarrega quando o servidor mudou', () => {
    expect(decidirSincronizacaoQuadro(base)).toBe('recarregar');
  });

  it('com edição pendente, só avisa (não perde a edição local)', () => {
    expect(decidirSincronizacaoQuadro({ ...base, temEdicaoPendente: true })).toBe('avisar');
  });

  it('não faz nada se nada mudou ou se a pessoa está arrastando', () => {
    expect(decidirSincronizacaoQuadro({ ...base, updatedAtServidor: base.updatedAtConhecido })).toBe('nada');
    expect(decidirSincronizacaoQuadro({ ...base, interagindo: true })).toBe('nada');
    expect(decidirSincronizacaoQuadro({ ...base, updatedAtServidor: null })).toBe('nada');
  });
});
