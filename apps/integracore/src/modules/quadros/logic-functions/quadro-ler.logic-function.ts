import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { lerQuadro } from 'src/modules/quadros/data/ler-quadro';
import { lerQuadroInputSchema } from 'src/modules/quadros/schemas/quadros-input.schema';
import { resumirQuadro } from 'src/modules/quadros/utils/resumir-quadro.util';
import { validarEntradaLerQuadro } from 'src/modules/quadros/utils/validar-entrada-ler-quadro.util';

const handler = async (input: unknown) => {
  const entrada = validarEntradaLerQuadro(input);

  if (!entrada.ok) {
    return { ok: false, erro: entrada.erro };
  }

  const quadro = await lerQuadro(new RestApiClient(), entrada.valor.quadroId);

  if (quadro === null) {
    return { ok: false, erro: `Quadro ${entrada.valor.quadroId} não encontrado.` };
  }

  const resumo = resumirQuadro(quadro.conteudo);

  return {
    ok: true,
    mensagem: resumo.texto,
    quadroId: quadro.id,
    nome: quadro.nome,
    atualizadoEm: quadro.updatedAt,
    resumo,
  };
};

export default defineLogicFunction({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.logicFunctions.ler,
  name: 'quadro_ler',
  description:
    'Lê um quadro e devolve um resumo legível: quantidade de elementos por tipo, cada elemento com id, texto, cor, posição e tamanho, quem liga em quem e a área ocupada. Use antes de alterar um quadro e para obter os ids necessários a quadro_remover_elementos.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: lerQuadroInputSchema },
});
