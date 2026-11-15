import { describe, expect, it, vi } from 'vitest';

import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';
import { fetchAllRestRecords } from 'src/modules/projetos/utils/fetch-all-rest-records.util';

const buildClient = (pages: unknown[]): RestClientLike & { get: ReturnType<typeof vi.fn> } => {
  const get = vi.fn();

  for (const page of pages) {
    get.mockResolvedValueOnce(page);
  }

  return { get, post: vi.fn(), patch: vi.fn() } as never;
};

describe('fetchAllRestRecords', () => {
  it('percorre as páginas pelo cursor', async () => {
    const client = buildClient([
      { data: { tasks: [{ id: '1' }] }, pageInfo: { hasNextPage: true, endCursor: 'c1' } },
      { data: { tasks: [{ id: '2' }] }, pageInfo: { hasNextPage: false, endCursor: 'c2' } },
    ]);

    const records = await fetchAllRestRecords(client, 'tasks', { filter: 'x' });

    expect(records).toEqual([{ id: '1' }, { id: '2' }]);
    expect(client.get).toHaveBeenCalledTimes(2);
    expect(client.get.mock.calls[0]).toEqual([
      '/rest/tasks',
      { query: { filter: 'x', limit: 200, starting_after: undefined } },
    ]);
    expect(client.get.mock.calls[1][1].query.starting_after).toBe('c1');
  });

  it('resposta vazia devolve []', async () => {
    expect(await fetchAllRestRecords(buildClient([{}]), 'tasks')).toEqual([]);
  });
});
