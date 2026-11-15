import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import {
  VOTAR_IDEIAS_FRONT_COMPONENT_ID,
  VOTAR_IDEIAS_ROUTE_PATH,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { runBulkIdeiaAction } from 'src/modules/projetos/front-components/utils/run-bulk-ideia-action.util';

const VotarIdeias = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={async () => {
        await runBulkIdeiaAction({
          routePath: VOTAR_IDEIAS_ROUTE_PATH,
          recordIds,
          successLabel: (count) => (count === 1 ? 'Voto registrado' : `${count} votos registrados`),
        });
      }}
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: VOTAR_IDEIAS_FRONT_COMPONENT_ID,
  name: 'votar-ideias',
  description: 'Soma 1 voto nas ideias selecionadas',
  component: VotarIdeias,
  isHeadless: true,
});
