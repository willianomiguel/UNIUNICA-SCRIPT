import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';

type Row = Record<string, unknown> & { id: string };

// Dublê em memória da API REST de registros (get por id, post, patch).
export const createFakeRestClient = (initial: Record<string, Row[]>) => {
  const store: Record<string, Row[]> = JSON.parse(JSON.stringify(initial));
  const singular: Record<string, string> = { ideias: 'ideia', projetos: 'projeto' };
  let nextId = 1;

  const client: RestClientLike = {
    get: async <T,>(path: string) => {
      const [, , plural, id] = path.split('/');
      const row = store[plural]?.find((item) => item.id === id);

      if (!row) {
        throw new Error(`404 ${path}`);
      }

      return { data: { [singular[plural]]: row } } as T;
    },
    post: async <T,>(path: string, body?: unknown) => {
      const plural = path.split('/')[2];
      const row = { ...(body as object), id: `novo-${nextId++}` } as Row;

      store[plural].push(row);

      return { data: { [`create${singular[plural][0].toUpperCase()}${singular[plural].slice(1)}`]: row } } as T;
    },
    patch: async <T,>(path: string, body?: unknown) => {
      const [, , plural, id] = path.split('/');
      const row = store[plural].find((item) => item.id === id);

      Object.assign(row ?? {}, body);

      return {} as T;
    },
  };

  return { client, store };
};
