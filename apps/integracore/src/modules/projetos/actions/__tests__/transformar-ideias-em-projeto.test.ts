import { describe, expect, it } from 'vitest';

import { createFakeRestClient } from 'src/modules/projetos/actions/__tests__/fake-rest-client';
import { transformarIdeiasEmProjeto } from 'src/modules/projetos/actions/transformar-ideias-em-projeto';

const today = Date.UTC(2026, 10, 15);

describe('transformarIdeiasEmProjeto', () => {
  it('cria o projeto, liga a ideia e muda o status', async () => {
    const { client, store } = createFakeRestClient({
      ideias: [{ id: 'a', titulo: 'Portal', area: 'DEV', pontuacao: 2, status: 'APROVADA' }],
      projetos: [],
    });

    const result = await transformarIdeiasEmProjeto(client, ['a'], today);

    expect(store.projetos).toEqual([
      expect.objectContaining({ id: 'novo-1', nome: 'Portal', area: 'DEV', status: 'PLANEJADO', trimestre: '2026-T4' }),
    ]);
    expect(store.ideias[0]).toMatchObject({ projetoId: 'novo-1', status: 'VIROU_PROJETO' });
    expect(result.results).toEqual([{ id: 'a', status: 'SUCCESS', projetoId: 'novo-1' }]);
  });

  it('é idempotente: rodar de novo ignora a ideia já transformada', async () => {
    const { client, store } = createFakeRestClient({
      ideias: [{ id: 'a', titulo: 'Portal' }],
      projetos: [],
    });

    await transformarIdeiasEmProjeto(client, ['a'], today);
    const second = await transformarIdeiasEmProjeto(client, ['a'], today);

    expect(store.projetos).toHaveLength(1);
    expect(second).toMatchObject({ successCount: 0, skippedCount: 1, ok: true });
  });

  it('ideia inexistente conta como falha', async () => {
    const { client } = createFakeRestClient({ ideias: [], projetos: [] });

    expect(await transformarIdeiasEmProjeto(client, ['x'], today)).toMatchObject({ failedCount: 1 });
  });
});
