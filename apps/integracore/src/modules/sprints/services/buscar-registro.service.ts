import { type RestApiClient, RestApiClientError } from 'integra-client-sdk/rest';

// Busca um registro por id pela API REST; devolve null se não existir.
export const buscarRegistro = async <T>(
  cliente: RestApiClient,
  nomePlural: string,
  nomeSingular: string,
  id: string,
): Promise<T | null> => {
  try {
    const resposta = await cliente.get<{ data?: Record<string, T> }>(
      `/rest/${nomePlural}/${id}`,
      { query: { depth: 0 } },
    );

    return resposta.data?.[nomeSingular] ?? null;
  } catch (erro) {
    if (erro instanceof RestApiClientError && erro.status === 404) {
      return null;
    }

    throw erro;
  }
};
