import { describe, expect, it } from 'vitest';

import { summarizeAlertaResults } from 'src/modules/avisos/utils/summarize-alerta-results.util';

describe('summarizeAlertaResults', () => {
  it('conta enviados, ignorados e falhas', () => {
    const summary = summarizeAlertaResults([
      { id: '1', nome: 'a', status: 'ENVIADO' },
      { id: '2', nome: 'b', status: 'IGNORADO' },
      { id: '3', nome: 'c', status: 'FALHOU', erro: 'x' },
    ]);

    expect(summary).toMatchObject({ ok: false, enviadosCount: 1, ignoradosCount: 1, falhasCount: 1 });
  });

  it('lista vazia é ok', () => {
    expect(summarizeAlertaResults([])).toEqual({ ok: true, enviadosCount: 0, ignoradosCount: 0, falhasCount: 0, results: [] });
  });
});
