import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, enqueueSnackbar, useSelectedRecordIds } from 'twenty-sdk/front-component';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';
import { TESTAR_ALERTA_ROUTE_PATH } from 'src/modules/avisos/constants/testar-alerta-route-path';
import { type AlertaRunSummary } from 'src/modules/avisos/types/alerta-run-summary';
import { buildTestarAlertaSnackbar } from 'src/modules/avisos/utils/build-testar-alerta-snackbar.util';

const execute = async (recordIds: string[]) => {
  try {
    const summary = await new RestApiClient().post<AlertaRunSummary>(`/s${TESTAR_ALERTA_ROUTE_PATH}`, {
      records: recordIds.map((id) => ({ id })),
    });

    await enqueueSnackbar(buildTestarAlertaSnackbar(summary));
  } catch (error) {
    await enqueueSnackbar({
      message: 'Falha ao testar o alerta.',
      variant: 'error',
      detailedMessage: error instanceof Error ? error.message : undefined,
    });
  }
};

const TestarAlerta = () => {
  const recordIds = useSelectedRecordIds();

  return <Command execute={() => execute(recordIds)} />;
};

export default defineFrontComponent({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.testarAlertaFrontComponent,
  name: 'testar-alerta',
  description: 'Envia uma mensagem de teste para os alertas selecionados.',
  component: TestarAlerta,
  isHeadless: true,
});
