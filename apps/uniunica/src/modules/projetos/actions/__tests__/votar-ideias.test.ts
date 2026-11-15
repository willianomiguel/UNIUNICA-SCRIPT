import { describe, expect, it } from 'vitest';

import { createFakeRestClient } from 'src/modules/projetos/actions/__tests__/fake-rest-client';
import { votarIdeias } from 'src/modules/projetos/actions/votar-ideias';

describe('votarIdeias', () => {
  it('soma 1 voto e recalcula a pontuação de cada ideia', async () => {
    const { client, store } = createFakeRestClient({
      ideias: [
        { id: 'a', impacto: 5, esforco: 1, votos: 2, pontuacao: 15 },
        { id: 'b', impacto: 3, esforco: 3, votos: null, pontuacao: 1 },
      ],
    });

    const result = await votarIdeias(client, ['a', 'b', 'nao-existe']);

    expect(store.ideias).toEqual([
      { id: 'a', impacto: 5, esforco: 1, votos: 3, pontuacao: 20 },
      { id: 'b', impacto: 3, esforco: 3, votos: 1, pontuacao: 2 },
    ]);
    expect(result).toMatchObject({ total: 3, successCount: 2, failedCount: 1, ok: false });
  });

  it('sem ids não faz nada', async () => {
    const { client } = createFakeRestClient({ ideias: [] });

    expect(await votarIdeias(client, [])).toMatchObject({ total: 0, ok: true });
  });
});
