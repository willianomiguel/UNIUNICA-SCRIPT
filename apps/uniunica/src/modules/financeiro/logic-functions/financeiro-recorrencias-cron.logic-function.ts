import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { gerarOcorrenciasRecorrentes } from 'src/modules/financeiro/utils/gerar-ocorrencias-recorrentes.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { marcarLancamentosAtrasados } from 'src/modules/financeiro/utils/marcar-lancamentos-atrasados.util';

const handler = async () => {
  const cliente = new RestApiClient({ runAs: 'application' });
  const hoje = hojeIso();

  const atrasados = await marcarLancamentosAtrasados(cliente, hoje);
  const recorrencias = await gerarOcorrenciasRecorrentes(cliente, hoje);

  const resultado = {
    hoje,
    marcadosComoAtrasados: atrasados.length,
    ocorrenciasCriadas: recorrencias.criados,
    ocorrenciasJaExistentes: recorrencias.ignorados,
  };

  console.log('[financeiro] rotina diária concluída', resultado);

  return resultado;
};

export default defineLogicFunction({
  universalIdentifier: FINANCEIRO_IDS.LOGIC_RECORRENCIAS_CRON,
  name: 'financeiro-rotina-diaria',
  description:
    'Diariamente: marca lançamentos pendentes vencidos como atrasados e gera a próxima ocorrência dos lançamentos recorrentes.',
  timeoutSeconds: 120,
  handler,
  // 06:17 em Brasília (09:17 UTC).
  cronTriggerSettings: {
    pattern: '17 9 * * *',
  },
});
