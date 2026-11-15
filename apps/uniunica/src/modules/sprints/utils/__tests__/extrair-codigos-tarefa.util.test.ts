import { describe, expect, it } from 'vitest';

import { extrairCodigosTarefa } from 'src/modules/sprints/utils/extrair-codigos-tarefa.util';

describe('extrairCodigosTarefa', () => {
  it('encontra códigos em título, branch e commits', () => {
    expect(
      extrairCodigosTarefa([
        'UNI-42: tela de login',
        'feature/uni-7-ajuste',
        'fix(UNI-42) e UNI-8',
      ]),
    ).toEqual(['UNI-42', 'UNI-7', 'UNI-8']);
  });

  it('ignora textos vazios e falsos positivos', () => {
    expect(
      extrairCodigosTarefa([null, undefined, '', 'MUNI-3', 'UNI-', 'UNI-0']),
    ).toEqual([]);
  });

  it('remove zeros à esquerda e não corta números', () => {
    expect(extrairCodigosTarefa(['UNI-007', 'UNI-1234x'])).toEqual([
      'UNI-7',
      'UNI-1234',
    ]);
  });
});
