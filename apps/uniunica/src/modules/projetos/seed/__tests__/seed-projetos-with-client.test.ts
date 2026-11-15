import { describe, expect, it } from 'vitest';

import { seedProjetosWithClient } from 'src/modules/projetos/seed/seed-projetos-with-client';
import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';

// Dublê em memória da API REST: guarda o que é criado e devolve nas listagens.
const buildFakeClient = () => {
  const store: Record<string, Array<Record<string, unknown>>> = { projetos: [], ideias: [] };

  const client: RestClientLike = {
    get: async <T,>(path: string) => {
      if (path === '/rest/workspaceMembers') {
        return { data: { workspaceMembers: [{ id: 'membro-1' }] } } as T;
      }

      const namePlural = path.replace('/rest/', '');

      return { data: { [namePlural]: store[namePlural] }, pageInfo: { hasNextPage: false } } as T;
    },
    post: async <T,>(path: string, body?: unknown) => {
      store[path.replace('/rest/', '')].push(body as Record<string, unknown>);

      return {} as T;
    },
    patch: async <T,>() => ({}) as T,
  };

  return { client, store };
};

describe('seedProjetosWithClient', () => {
  it('cria projetos e ideias com responsável/autor', async () => {
    const { client, store } = buildFakeClient();

    await seedProjetosWithClient(client);

    expect(store.projetos.length).toBeGreaterThanOrEqual(5);
    expect(store.ideias.length).toBe(5);
    expect(store.projetos.every((projeto) => projeto.responsavelId === 'membro-1')).toBe(true);
    expect(store.ideias.find((ideia) => ideia.titulo === 'Painel semanal de indicadores')?.pontuacao).toBe(8);
    expect(store.ideias.every((ideia) => ideia.autorId === 'membro-1')).toBe(true);
  });

  it('é idempotente: rodar duas vezes não duplica nada', async () => {
    const { client, store } = buildFakeClient();

    await seedProjetosWithClient(client);
    const snapshot = JSON.stringify(store);

    await seedProjetosWithClient(client);

    expect(JSON.stringify(store)).toBe(snapshot);
  });
});
