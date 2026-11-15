import { RestApiClient } from 'twenty-client-sdk/rest';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { aplicarRecalculoMetas } from 'src/modules/metas/utils/aplicar-recalculo-metas.util';
import { semearMetas } from 'src/modules/metas/utils/semear-metas.util';

// Chamado pelo post-install único do app. Idempotente.
const seedMetas = async (): Promise<void> => {
  const cliente = new RestApiClient({ runAs: 'application' });
  const hoje = hojeIso();
  const criadas = await semearMetas(cliente, hoje);
  const recalculo = await aplicarRecalculoMetas(cliente, hoje);

  console.log('[metas] seed concluído', { criadas, ...recalculo });
};

export default seedMetas;
