import { defineFrontComponent } from 'integra-sdk/define';
import { Command, useSelectedRecordIds } from 'integra-sdk/front-component';

import { votarIdeias } from 'src/modules/projetos/actions/votar-ideias';
import { VOTAR_IDEIAS_FRONT_COMPONENT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { runBulkIdeiaAction } from 'src/modules/projetos/front-components/utils/run-bulk-ideia-action.util';

const VotarIdeias = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={async () => {
        await runBulkIdeiaAction({
          action: (client) => votarIdeias(client, recordIds),
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
