import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';

type RespostaLista = {
  data?: Record<string, RegistroIntegraCore[] | undefined>;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

const TAMANHO_PAGINA = 200;
const LIMITE_PAGINAS = 100;

// Lê todas as páginas de /rest/<plural>, com filtro opcional na sintaxe REST
// do IntegraCore (ex.: `status[eq]:"PENDENTE"`).
export const listarRegistros = async (
  cliente: ClienteRest,
  namePlural: string,
  filtro?: string,
): Promise<RegistroIntegraCore[]> => {
  const registros: RegistroIntegraCore[] = [];
  let cursor: string | undefined;

  for (let pagina = 0; pagina < LIMITE_PAGINAS; pagina++) {
    const resposta = await cliente.get<RespostaLista>(`/rest/${namePlural}`, {
      query: {
        limit: TAMANHO_PAGINA,
        filter: filtro,
        starting_after: cursor,
      },
    });

    registros.push(...(resposta.data?.[namePlural] ?? []));

    const endCursor = resposta.pageInfo?.endCursor;

    if (!resposta.pageInfo?.hasNextPage || !endCursor) {
      break;
    }

    cursor = endCursor;
  }

  return registros;
};
