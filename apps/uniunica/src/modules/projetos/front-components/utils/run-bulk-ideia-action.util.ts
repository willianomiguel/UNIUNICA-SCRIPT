import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';
import { buildBulkActionSnackbar } from 'src/modules/projetos/utils/build-bulk-action-snackbar.util';

// Roda a ação em lote com as permissões de quem clicou (API REST direta, sem depender
// da execução de funções no servidor) e mostra o resumo num snackbar.
export const runBulkIdeiaAction = async ({
  action,
  successLabel,
}: {
  action: (client: RestClientLike) => Promise<BulkActionResult>;
  successLabel: (count: number) => string;
}): Promise<BulkActionResult | null> => {
  try {
    const result = await action(new RestApiClient());

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
