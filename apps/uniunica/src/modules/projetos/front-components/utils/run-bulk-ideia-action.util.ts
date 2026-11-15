import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { buildBulkActionSnackbar } from 'src/modules/projetos/utils/build-bulk-action-snackbar.util';

// Chama UMA vez a rota em lote do módulo com as ideias selecionadas e mostra o resultado.
export const runBulkIdeiaAction = async ({
  routePath,
  recordIds,
  successLabel,
}: {
  routePath: string;
  recordIds: string[];
  successLabel: (count: number) => string;
}): Promise<BulkActionResult | null> => {
  try {
    const result = await new RestApiClient().post<BulkActionResult>(`/s${routePath}`, {
      records: recordIds.map((id) => ({ id })),
    });

    await enqueueSnackbar(buildBulkActionSnackbar(result, successLabel));

    return result;
  } catch (error) {
    await enqueueSnackbar({
      message: 'Não foi possível concluir a ação.',
      variant: 'error',
      detailedMessage: error instanceof Error ? error.message : undefined,
    });

    return null;
  }
};
