import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { aplicarEventoGithub } from 'src/modules/sprints/services/aplicar-evento-github.service';
import { type EventoGithubInterpretado } from 'src/modules/sprints/types/evento-github-interpretado';

type Entrada = {
  evento?: EventoGithubInterpretado;
  entrega?: string | null;
  // Quando enfileirado por uma rota, o payload pode vir dentro de "body".
  body?: { evento?: EventoGithubInterpretado; entrega?: string | null };
};

// Atualiza as tarefas citadas num evento do GitHub (já validado pela rota):
// liga o PR e a branch e move o status (PR aberto -> em andamento,
// PR mergeado -> concluída).
const handler = async (entrada: Entrada) => {
  const evento = entrada.evento ?? entrada.body?.evento;

  if (!evento || !Array.isArray(evento.codigos)) {
    return { ok: false, erro: 'Evento ausente ou inválido' };
  }

  const resultados = await aplicarEventoGithub(new RestApiClient(), evento);

  return {
    ok: true,
    entrega: entrada.entrega ?? entrada.body?.entrega ?? null,
    atualizadas: resultados.filter((r) => r.status === 'ATUALIZADA').length,
    naoEncontradas: resultados.filter((r) => r.status === 'NAO_ENCONTRADA')
      .length,
    resultados,
  };
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.githubWebhookProcessar,
  name: 'sprints-github-processar-evento',
  description:
    'Aplica nas tarefas um evento do GitHub já validado (PR, branch e status)',
  timeoutSeconds: 30,
  handler,
});
