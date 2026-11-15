import { type RestApiClient } from 'twenty-client-sdk/rest';

import { sendAlertaNotification } from 'src/modules/avisos/clients/send-alerta-notification';
import { computeAlertaMetric } from 'src/modules/avisos/data/compute-alerta-metric';
import { updateAlerta } from 'src/modules/avisos/data/update-alerta';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';
import { type AlertaRunResult } from 'src/modules/avisos/types/alerta-run-result';
import { decideAlertaAction } from 'src/modules/avisos/utils/decide-alerta-action.util';
import { renderAlertaMessage } from 'src/modules/avisos/utils/render-alerta-message.util';
import { toErrorMessage } from 'src/modules/avisos/utils/to-error-message.util';

// Avalia uma regra ativa: calcula a métrica, respeita o intervalo mínimo, envia e grava o resultado.
export const evaluateAlerta = async (
  client: RestApiClient,
  rule: AlertaRule,
  now: Date,
): Promise<AlertaRunResult> => {
  const base = { id: rule.id, nome: rule.nome };
  const nowIso = now.toISOString();

  if (rule.metrica === null) {
    await updateAlerta(client, rule.id, { ultimaVerificacao: nowIso, ultimoErro: 'Escolha uma métrica.' });

    return { ...base, status: 'FALHOU', erro: 'Métrica não definida' };
  }

  let valor: number;

  try {
    valor = await computeAlertaMetric(client, rule.metrica, rule.janelaDias, now);
  } catch (error) {
    const erro = toErrorMessage(error);

    await updateAlerta(client, rule.id, { ultimaVerificacao: nowIso, ultimoErro: erro });

    return { ...base, status: 'FALHOU', erro };
  }

  const decision = decideAlertaAction(rule, valor, now);

  if (decision.action === 'SKIP') {
    await updateAlerta(client, rule.id, { ultimoValor: valor, ultimaVerificacao: nowIso, ultimoErro: null });

    return { ...base, status: 'IGNORADO', valor, motivo: decision.reason };
  }

  try {
    await sendAlertaNotification({
      rule,
      valor,
      texto: renderAlertaMessage(rule, valor),
      isTest: false,
      avaliadoEm: nowIso,
    });
    await updateAlerta(client, rule.id, {
      ultimoValor: valor,
      ultimaVerificacao: nowIso,
      ultimoDisparo: nowIso,
      ultimoErro: null,
    });

    return { ...base, status: 'ENVIADO', valor };
  } catch (error) {
    const erro = toErrorMessage(error);

    await updateAlerta(client, rule.id, { ultimoValor: valor, ultimaVerificacao: nowIso, ultimoErro: erro });

    return { ...base, status: 'FALHOU', valor, erro };
  }
};
