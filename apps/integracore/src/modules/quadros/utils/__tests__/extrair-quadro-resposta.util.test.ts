import { describe, expect, it } from 'vitest';

import { extrairQuadroResposta } from 'src/modules/quadros/utils/extrair-quadro-resposta.util';

describe('extrairQuadroResposta', () => {
  it('lê { data: { quadro } } e normaliza o conteúdo', () => {
    const r = extrairQuadroResposta({
      data: { quadro: { id: 'q1', nome: 'Meu', updatedAt: '2026-01-01', conteudo: 'lixo' } },
    });

    expect(r).toEqual({ id: 'q1', nome: 'Meu', updatedAt: '2026-01-01', conteudo: { versao: 1, elementos: [] } });
  });

  it('aceita registro direto em data e rejeita formatos sem id', () => {
    expect(extrairQuadroResposta({ data: { id: 'q2', conteudo: null } })?.id).toBe('q2');
    expect(extrairQuadroResposta({ data: {} })).toBeNull();
    expect(extrairQuadroResposta(null)).toBeNull();
  });
});
