import { type RestApiClient } from 'integra-client-sdk/rest';

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type QuadroLido } from 'src/modules/quadros/types/quadro-lido';
import { aplicarConteudoNaCena } from 'src/modules/quadros/utils/aplicar-conteudo-na-cena.util';

// Grava na cena do Excalidraw o que a ferramenta mudou na visão simplificada. Só atualiza o campo `cena`;
// nunca apaga nem recria o registro.
export const gravarConteudoQuadro = async (
  client: RestApiClient,
  quadro: QuadroLido,
  conteudo: ConteudoQuadro,
): Promise<void> => {
  const cena = aplicarConteudoNaCena(quadro.cena, quadro.conteudo, conteudo, { agora: Date.now(), aleatorio: Math.random });

  await client.patch(`/rest/quadros/${quadro.id}`, { cena });
};
