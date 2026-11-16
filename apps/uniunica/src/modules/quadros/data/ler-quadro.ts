import { type RestApiClient, RestApiClientError } from 'twenty-client-sdk/rest';

import { type QuadroLido } from 'src/modules/quadros/types/quadro-lido';
import { extrairQuadroResposta } from 'src/modules/quadros/utils/extrair-quadro-resposta.util';

// null só quando o quadro não existe; outros erros (permissão, servidor) sobem para a ferramenta.
export const lerQuadro = async (client: RestApiClient, quadroId: string): Promise<QuadroLido | null> => {
  try {
    const resposta = await client.get<unknown>(`/rest/quadros/${quadroId}`);

    return extrairQuadroResposta(resposta);
  } catch (erro) {
    if (erro instanceof RestApiClientError && erro.status === 404) {
      return null;
    }

    throw new Error(
      erro instanceof RestApiClientError && erro.status === 403
        ? 'Sem permissão para ler este quadro.'
        : 'Não foi possível ler o quadro agora. Tente de novo.',
    );
  }
};
