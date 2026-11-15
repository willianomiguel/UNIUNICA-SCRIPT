import { type RestApiClient } from 'twenty-client-sdk/rest';

import { sendAlertaNotification } from 'src/modules/avisos/clients/send-alerta-notification';
import { computeAlertaMetric } from 'src/modules/avisos/data/compute-alerta-metric';
import { updateAlerta } from 'src/modules/avisos/data/update-alerta';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';
import { type AlertaRunResult } from 'src/modules/avisos/types/alerta-run-result';
import { renderAlertaMessage } from 'src/modules/avisos/utils/render-alerta-message.util';
import { toErrorMessage } from 'src/modules/avisos/utils/to-error-message.util';

// Envia agora uma mensagem de teste, sem olhar condição nem intervalo mínimo e sem mexer no último disparo.
export const testAlerta = async (
  client: RestApiClient,
  rule: AlertaRule,
  now: Date,
): Promise<AlertaRunResult> => {
  const base = { id: rule.id, nome: rule.nome };
  let valor = 0;
  let aviso = '';

  if (rule.metrica !== null) {
    try {
      valor = await computeAlertaMetric(client, rule.metrica, rule.janelaDias, now);
    } catch (error) {
      aviso = ` (valor indisponível: ${toErrorMessage(error)})`;
    }
  }

  try {
    await sendAlertaNotification({
      rule,
      valor,
      texto: `🧪 Teste — ${renderAlertaMessage(rule, valor)}${aviso}`,
      isTest: true,
      avaliadoEm: now.toISOString(),
    });
    await updateAlerta(client, rule.id, { ultimoErro: null });

    return { ...base, status: 'ENVIADO', valor };
  } catch (error) {
    const erro = toErrorMessage(error);

    await updateAlerta(client, rule.id, { ultimoErro: erro });

    return { ...base, status: 'FALHOU', valor, erro };
  }
};
