import { RestApiClient } from 'twenty-client-sdk/rest';

import { seedProjetosWithClient } from 'src/modules/projetos/seed/seed-projetos-with-client';

// Chamado pelo post-install único do app (ver docs/CONTRATO-MODULOS.md).
const seedProjetos = async (): Promise<void> => {
  await seedProjetosWithClient(new RestApiClient());
};

export default seedProjetos;
