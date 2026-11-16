import { type RestApiClient } from 'integra-client-sdk/rest';

type RespostaLista = {
  data?: Record<string, unknown[]>;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

const LIMITE_POR_PAGINA = 200;
const MAXIMO_PAGINAS = 20;

// Lista registros pela API REST do IntegraCore, seguindo a paginação.
export const listarRegistros = async <T>(
  cliente: RestApiClient,
  nomePlural: string,
  consulta: Record<string, string | undefined> = {},
): Promise<T[]> => {
  const registros: T[] = [];
  let cursor: string | undefined;

  for (let pagina = 0; pagina < MAXIMO_PAGINAS; pagina++) {
    const resposta = await cliente.get<RespostaLista>(`/rest/${nomePlural}`, {
      query: {
        ...consulta,
        limit: LIMITE_POR_PAGINA,
        starting_after: cursor,
      },
    });

    registros.push(...((resposta.data?.[nomePlural] ?? []) as T[]));

    if (!resposta.pageInfo?.hasNextPage || !resposta.pageInfo.endCursor) {
      break;
    }

    cursor = resposta.pageInfo.endCursor;
  }

  return registros;
};
