import { RestApiClient } from 'twenty-client-sdk/rest';

// GraphQL cru via RestApiClient: não depende do cliente gerado (que pode não conhecer objetos de outros módulos).
export const executarGraphql = async <T = Record<string, any>>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const resposta = await new RestApiClient().post<{
    data?: T;
    errors?: Array<{ message?: string }>;
  }>('/graphql', { query, variables });

  if (resposta?.errors?.length) {
    throw new Error(
      resposta.errors.map((erro) => erro.message ?? 'Erro GraphQL').join('; '),
    );
  }

  return (resposta?.data ?? {}) as T;
};
