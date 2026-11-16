import { describe, expect, it } from 'vitest';

import { resumirResultadosAcao } from 'src/modules/sprints/utils/resumir-resultados-acao.util';

describe('resumirResultadosAcao', () => {
  it('conta cada situação', () => {
    const resumo = resumirResultadosAcao([
      { id: 'a', status: 'OK', mensagem: '' },
      { id: 'b', status: 'IGNORADA', mensagem: '' },
      { id: 'c', status: 'NAO_ENCONTRADA', mensagem: '' },
      { id: 'd', status: 'OK', mensagem: '' },
    ]);

    expect(resumo).toMatchObject({ ok: true, sucesso: 2, ignoradas: 1, naoEncontradas: 1, falhas: 0 });
  });

  it('não ok quando há falha', () => {
    expect(resumirResultadosAcao([{ id: 'a', status: 'FALHOU', mensagem: 'x' }]).ok).toBe(false);
  });

  it('lista vazia', () => {
    expect(resumirResultadosAcao([])).toMatchObject({ ok: true, sucesso: 0 });
  });
});
