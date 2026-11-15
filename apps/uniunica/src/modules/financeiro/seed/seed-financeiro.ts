import { RestApiClient } from 'twenty-client-sdk/rest';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { semearFinanceiro } from 'src/modules/financeiro/utils/semear-financeiro.util';

// Chamado pelo post-install único do app. Idempotente.
const seedFinanceiro = async (): Promise<void> => {
  const resultado = await semearFinanceiro(
    new RestApiClient({ runAs: 'application' }),
    hojeIso(),
  );

  console.log('[financeiro] seed concluído', resultado);
};

export default seedFinanceiro;
