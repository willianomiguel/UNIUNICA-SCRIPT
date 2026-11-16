import { executarGraphql } from 'src/modules/trafego/services/executar-graphql.service';

const TAMANHO_PAGINA = 200;

// Lê todas as páginas de um objeto (até `limite` registros).
export const listarTodos = async ({
  plural,
  tipoFiltro,
  campos,
  filtro,
  limite = 10_000,
}: {
  plural: string;
  tipoFiltro: string;
  campos: string;
  filtro?: Record<string, unknown>;
  limite?: number;
}): Promise<Array<Record<string, any>>> => {
  const query = `query Listar($filter: ${tipoFiltro}, $after: String) {
    ${plural}(filter: $filter, first: ${TAMANHO_PAGINA}, after: $after) {
      edges { node { ${campos} } }
      pageInfo { hasNextPage endCursor }
    }
  }`;

  const registros: Array<Record<string, any>> = [];
  let cursor: string | null = null;

  do {
    const dados: Record<string, any> = await executarGraphql(query, {
      filter: filtro ?? {},
      after: cursor,
    });
    const conexao = dados[plural];

    registros.push(...(conexao?.edges ?? []).map((edge: { node: Record<string, any> }) => edge.node));
    cursor = conexao?.pageInfo?.hasNextPage ? conexao.pageInfo.endCursor : null;
  } while (cursor && registros.length < limite);

  return registros;
};
