import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';

type RestListResponse<T> = {
  data?: Record<string, T[] | undefined>;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

const PAGE_SIZE = 200;
const MAX_PAGES = 50;

// Lê todos os registros de `/rest/<namePlural>`, página a página (cursor `starting_after`).
export const fetchAllRestRecords = async <T>(
  client: RestClientLike,
  namePlural: string,
  query: Record<string, string> = {},
): Promise<T[]> => {
  const records: T[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await client.get<RestListResponse<T>>(`/rest/${namePlural}`, {
      query: { ...query, limit: PAGE_SIZE, starting_after: cursor },
    });

    records.push(...(response?.data?.[namePlural] ?? []));

    const endCursor = response?.pageInfo?.endCursor;

    if (!response?.pageInfo?.hasNextPage || !endCursor) {
      break;
    }

    cursor = endCursor;
  }

  return records;
};
