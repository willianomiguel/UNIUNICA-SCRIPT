import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { gravarConteudoQuadro } from 'src/modules/quadros/data/gravar-conteudo-quadro';
import { lerQuadro } from 'src/modules/quadros/data/ler-quadro';
import { removerElementosInputSchema } from 'src/modules/quadros/schemas/quadros-input.schema';
import { removerElementosQuadro } from 'src/modules/quadros/utils/remover-elementos-quadro.util';
import { validarEntradaRemoverElementos } from 'src/modules/quadros/utils/validar-entrada-remover-elementos.util';

const handler = async (input: unknown) => {
  const entrada = validarEntradaRemoverElementos(input);

  if (!entrada.ok) {
    return { ok: false, erro: entrada.erro };
  }

  const client = new RestApiClient();
  const quadro = await lerQuadro(client, entrada.valor.quadroId);

  if (quadro === null) {
    return { ok: false, erro: `Quadro ${entrada.valor.quadroId} não encontrado.` };
  }

  const resultado = removerElementosQuadro(quadro.conteudo, entrada.valor.ids);

  if (resultado.removidos.length === 0) {
    return {
      ok: false,
      erro: 'Nenhum dos ids informados existe no quadro; nada foi alterado. Use quadro_ler para ver os ids.',
      naoEncontrados: resultado.naoEncontrados,
    };
  }

  await gravarConteudoQuadro(client, quadro.id, resultado.conteudo);

  return {
    ok: true,
    mensagem: `${resultado.removidos.length} elementos removidos (e ${resultado.setasRemovidasPorLigacao.length} setas presas a eles) do quadro "${quadro.nome}".`,
    quadroId: quadro.id,
    removidos: resultado.removidos,
    setasRemovidasPorLigacao: resultado.setasRemovidasPorLigacao,
    naoEncontrados: resultado.naoEncontrados,
    totalDeElementos: resultado.conteudo.elementos.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.logicFunctions.removerElementos,
  name: 'quadro_remover_elementos',
  description:
    'Remove elementos de um quadro pelos ids (obtidos com quadro_ler). Setas presas às formas removidas também saem. Nunca apaga o quadro em si; apagar o quadro inteiro é decisão do usuário.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: removerElementosInputSchema },
});
