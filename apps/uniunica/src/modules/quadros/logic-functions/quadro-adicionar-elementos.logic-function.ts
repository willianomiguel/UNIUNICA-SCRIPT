import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { gravarConteudoQuadro } from 'src/modules/quadros/data/gravar-conteudo-quadro';
import { lerQuadro } from 'src/modules/quadros/data/ler-quadro';
import { adicionarElementosInputSchema } from 'src/modules/quadros/schemas/quadros-input.schema';
import { mesclarElementosQuadro } from 'src/modules/quadros/utils/mesclar-elementos-quadro.util';
import { validarEntradaAdicionarElementos } from 'src/modules/quadros/utils/validar-entrada-adicionar-elementos.util';

const handler = async (input: unknown) => {
  const entrada = validarEntradaAdicionarElementos(input);

  if (!entrada.ok) {
    return { ok: false, erro: entrada.erro };
  }

  const client = new RestApiClient();
  const quadro = await lerQuadro(client, entrada.valor.quadroId);

  if (quadro === null) {
    return { ok: false, erro: `Quadro ${entrada.valor.quadroId} não encontrado.` };
  }

  const resultado = mesclarElementosQuadro(quadro.conteudo, entrada.valor.elementos);

  if (!resultado.ok) {
    return { ok: false, erro: resultado.erro };
  }

  await gravarConteudoQuadro(client, quadro.id, resultado.conteudo);

  return {
    ok: true,
    mensagem: `${resultado.idsCriados.length} elementos adicionados ao quadro "${quadro.nome}".`,
    quadroId: quadro.id,
    idsCriados: resultado.idsCriados,
    totalDeElementos: resultado.conteudo.elementos.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.logicFunctions.adicionarElementos,
  name: 'quadro_adicionar_elementos',
  description:
    'Adiciona ao quadro elementos já posicionados (retângulo, elipse, nota, texto, seta, traço), para ajustes finos. Setas podem ser presas a formas com deId/paraId e têm as pontas recalculadas. Para diagramas inteiros prefira quadro_desenhar_diagrama. Leia o quadro antes com quadro_ler para não sobrepor o que existe.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: adicionarElementosInputSchema },
});
