import { describe, expect, it } from 'vitest';

import { buildTestarAlertaSnackbar } from 'src/modules/avisos/utils/build-testar-alerta-snackbar.util';
import { summarizeAlertaResults } from 'src/modules/avisos/utils/summarize-alerta-results.util';

describe('buildTestarAlertaSnackbar', () => {
  it('sucesso para um e para vários', () => {
    expect(buildTestarAlertaSnackbar(summarizeAlertaResults([{ id: '1', nome: 'a', status: 'ENVIADO' }]))).toEqual({
      message: 'Mensagem de teste enviada.',
      variant: 'success',
    });
    expect(
      buildTestarAlertaSnackbar(
        summarizeAlertaResults([
          { id: '1', nome: 'a', status: 'ENVIADO' },
          { id: '2', nome: 'b', status: 'ENVIADO' },
        ]),
      ).message,
    ).toBe('2 mensagens de teste enviadas.');
  });

  it('erro total e parcial trazem o primeiro erro', () => {
    expect(
      buildTestarAlertaSnackbar(summarizeAlertaResults([{ id: '1', nome: 'a', status: 'FALHOU', erro: 'HTTP 404' }])),
    ).toEqual({ message: 'Falha ao enviar o teste.', variant: 'error', detailedMessage: 'HTTP 404' });
    expect(
      buildTestarAlertaSnackbar(
        summarizeAlertaResults([
          { id: '1', nome: 'a', status: 'ENVIADO' },
          { id: '2', nome: 'b', status: 'FALHOU', erro: 'x' },
        ]),
      ),
    ).toMatchObject({ message: '1 de 2 testes falharam.', variant: 'warning' });
  });

  it('aviso quando nada foi selecionado', () => {
    expect(buildTestarAlertaSnackbar(summarizeAlertaResults([])).variant).toBe('warning');
  });
});
