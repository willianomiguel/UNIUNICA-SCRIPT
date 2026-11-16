import { describe, expect, it } from 'vitest';

import { buildBulkActionSnackbar } from 'src/modules/projetos/utils/build-bulk-action-snackbar.util';
import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

const label = (count: number) => `${count} voto(s) registrado(s)`;

describe('buildBulkActionSnackbar', () => {
  it('sucesso total', () => {
    expect(buildBulkActionSnackbar(summarizeBulkResults([{ id: 'a', status: 'SUCCESS' }]), label)).toEqual({
      message: '1 voto(s) registrado(s).',
      variant: 'success',
    });
  });

  it('parcial vira aviso com detalhes', () => {
    expect(
      buildBulkActionSnackbar(
        summarizeBulkResults([
          { id: 'a', status: 'SUCCESS' },
          { id: 'b', status: 'SKIPPED', message: 'Já virou projeto' },
          { id: 'c', status: 'FAILED', message: 'erro' },
        ]),
        label,
      ),
    ).toEqual({
      message: '1 voto(s) registrado(s), 1 ignorado(s), 1 com erro.',
      variant: 'warning',
      detailedMessage: 'Já virou projeto',
    });
  });

  it('falha total vira erro', () => {
    expect(
      buildBulkActionSnackbar(summarizeBulkResults([{ id: 'a', status: 'FAILED', message: 'x' }]), label),
    ).toEqual({ message: 'Não foi possível concluir a ação.', variant: 'error', detailedMessage: 'x' });
  });

  it('nada selecionado', () => {
    expect(buildBulkActionSnackbar(summarizeBulkResults([]), label).variant).toBe('warning');
  });
});
