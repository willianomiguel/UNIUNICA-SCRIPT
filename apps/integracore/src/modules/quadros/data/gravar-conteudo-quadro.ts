import { type RestApiClient } from 'integra-client-sdk/rest';

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';

// Só atualiza o campo conteudo; nunca apaga nem recria o registro.
export const gravarConteudoQuadro = async (
  client: RestApiClient,
  quadroId: string,
  conteudo: ConteudoQuadro,
): Promise<void> => {
  await client.patch(`/rest/quadros/${quadroId}`, { conteudo });
};
