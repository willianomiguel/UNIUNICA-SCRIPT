import { useCallback, useEffect, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';

import { type WikiDocument } from 'src/modules/docs/types/wiki-document';
import { parseWikiDocuments } from 'src/modules/docs/utils/parse-wiki-documents.util';

type WikiDocumentsState =
  | { status: 'loading'; documents: WikiDocument[] }
  | { status: 'ready'; documents: WikiDocument[] }
  | { status: 'error'; documents: WikiDocument[]; message: string };

type RestPage = {
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

const PAGE_SIZE = 200;
const MAX_PAGES = 10;

const fetchAllDocuments = async (): Promise<WikiDocument[]> => {
  const client = new RestApiClient();
  const documents: WikiDocument[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const response: RestPage = await client.get<RestPage>('/rest/documentos', {
      query: {
        limit: PAGE_SIZE,
        depth: 0,
        filter: 'status[neq]:ARQUIVADO',
        starting_after: cursor ?? undefined,
      },
    });

    documents.push(...parseWikiDocuments(response));

    if (response.pageInfo?.hasNextPage !== true || !response.pageInfo.endCursor) {
      break;
    }
    cursor = response.pageInfo.endCursor;
  }

  return documents;
};

export const useWikiDocuments = () => {
  const [state, setState] = useState<WikiDocumentsState>({
    status: 'loading',
    documents: [],
  });

  const reload = useCallback(async () => {
    setState((previous) => ({ status: 'loading', documents: previous.documents }));

    try {
      setState({ status: 'ready', documents: await fetchAllDocuments() });
    } catch (error) {
      setState((previous) => ({
        status: 'error',
        documents: previous.documents,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload };
};
