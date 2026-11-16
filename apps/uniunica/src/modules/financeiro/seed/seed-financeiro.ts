import { RestApiClient } from 'twenty-client-sdk/rest';

import { semearFinanceiro } from 'src/modules/financeiro/utils/semear-financeiro.util';

// Chamado pelo post-install único do app. Idempotente. Só cria as categorias padrão.
const seedFinanceiro = async (): Promise<void> => {
  const resultado = await semearFinanceiro(new RestApiClient({ runAs: 'application' }));

  console.log('[financeiro] seed concluído', resultado);
};

export default seedFinanceiro;
