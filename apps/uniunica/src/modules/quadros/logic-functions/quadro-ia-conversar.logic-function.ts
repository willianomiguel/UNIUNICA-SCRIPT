import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';
import { ai } from 'twenty-sdk/logic-function';

import { QUADRO_IA_ROTA } from 'src/modules/quadros/constants/quadro-ia-rota.constant';
import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { gravarConteudoQuadro } from 'src/modules/quadros/data/gravar-conteudo-quadro';
import { lerQuadro } from 'src/modules/quadros/data/ler-quadro';
import { montarMensagensIa, traduzirErroIa, validarEntradaConversaIa } from 'src/modules/quadros/utils/conversa-ia-quadro.util';
import { mesclarDiagramaQuadro } from 'src/modules/quadros/utils/mesclar-diagrama-quadro.util';
import { INSTRUCOES_PLANO_IA, interpretarPlanoIa, SCHEMA_PLANO_IA } from 'src/modules/quadros/utils/plano-ia-quadro.util';
import { resumirQuadro } from 'src/modules/quadros/utils/resumir-quadro.util';
import { validarEntradaDesenharDiagrama } from 'src/modules/quadros/utils/validar-entrada-desenhar-diagrama.util';

const falha = (erro: string, detalhe?: string) => ({ ok: false, erro, ...(detalhe ? { detalhe: detalhe.slice(0, 300) } : {}) });

const handler = async (evento: { body?: unknown }) => {
  const entrada = validarEntradaConversaIa(evento?.body ?? evento);

  if (!entrada.ok) {
    return falha(entrada.erro);
  }

  try {
    const cliente = new RestApiClient();
    const quadro = await lerQuadro(cliente, entrada.valor.quadroId);

    if (quadro === null) {
      return falha('Quadro não encontrado.');
    }

    const resumo = resumirQuadro(quadro.conteudo).texto;
    const resultado = await ai.generate({
      instructions: `${INSTRUCOES_PLANO_IA}\n\nQuadro atual ("${quadro.nome}"):\n${resumo.slice(0, 6000)}`,
      input: montarMensagensIa(entrada.valor),
      responseFormat: { type: 'json', schema: SCHEMA_PLANO_IA },
    });

    if (!resultado.success) {
      return falha(traduzirErroIa(resultado.error), resultado.error ?? undefined);
    }

    const plano = interpretarPlanoIa(resultado.object);

    if (plano === null) {
      return falha('A IA respondeu num formato inesperado. Tente pedir de outro jeito.', resultado.text ?? undefined);
    }

    if (plano.diagrama === null) {
      return { ok: true, resposta: plano.resposta, desenhou: false };
    }

    const desenho = validarEntradaDesenharDiagrama({ quadroId: quadro.id, ...plano.diagrama });

    if (!desenho.ok) {
      return falha(`A IA montou um desenho inválido: ${desenho.erro}`);
    }

    const mescla = mesclarDiagramaQuadro(quadro.conteudo, desenho.valor);

    if (!mescla.ok) {
      return falha(mescla.erro);
    }

    await gravarConteudoQuadro(cliente, quadro.id, mescla.conteudo);

    return { ok: true, resposta: plano.resposta, desenhou: true, criados: mescla.criados };
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);

    return falha(traduzirErroIa(detalhe), detalhe);
  }
};

export default defineLogicFunction({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.logicFunctions.conversarIa,
  name: 'quadro-ia-conversar',
  description: 'Conversa com a IA dentro do quadro: a IA devolve um plano de desenho e o app desenha com layout automático.',
  timeoutSeconds: 120,
  handler,
  httpRouteTriggerSettings: {
    path: QUADRO_IA_ROTA,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
