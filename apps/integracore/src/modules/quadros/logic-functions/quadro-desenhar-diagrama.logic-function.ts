import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { gravarConteudoQuadro } from 'src/modules/quadros/data/gravar-conteudo-quadro';
import { lerQuadro } from 'src/modules/quadros/data/ler-quadro';
import { desenharDiagramaInputSchema } from 'src/modules/quadros/schemas/quadros-input.schema';
import { mesclarDiagramaQuadro } from 'src/modules/quadros/utils/mesclar-diagrama-quadro.util';
import { validarEntradaDesenharDiagrama } from 'src/modules/quadros/utils/validar-entrada-desenhar-diagrama.util';

const handler = async (input: unknown) => {
  const entrada = validarEntradaDesenharDiagrama(input);

  if (!entrada.ok) {
    return { ok: false, erro: entrada.erro };
  }

  const client = new RestApiClient();
  const quadro = await lerQuadro(client, entrada.valor.quadroId);

  if (quadro === null) {
    return { ok: false, erro: `Quadro ${entrada.valor.quadroId} não encontrado.` };
  }

  const resultado = mesclarDiagramaQuadro(quadro.conteudo, entrada.valor);

  if (!resultado.ok) {
    return { ok: false, erro: resultado.erro };
  }

  await gravarConteudoQuadro(client, quadro.id, resultado.conteudo);

  return {
    ok: true,
    mensagem: `Diagrama desenhado no quadro "${quadro.nome}": ${resultado.criados} elementos criados.`,
    quadroId: quadro.id,
    mapaIds: resultado.mapaIds,
    totalDeElementos: resultado.conteudo.elementos.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.logicFunctions.desenharDiagrama,
  name: 'quadro_desenhar_diagrama',
  description:
    'Desenha um diagrama (fluxograma, organograma, mapa de processos) em um quadro. Você descreve as caixas (nos) e as setas (ligacoes) e o app calcula posições, tamanhos e ancora as setas nas bordas. Use esta ferramenta de preferência a quadro_adicionar_elementos. Por padrão adiciona ao lado do que já existe; só use substituir=true se o usuário pedir para refazer o quadro. Descubra o quadroId com find_many_quadros.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: desenharDiagramaInputSchema },
});
