import { defineFrontComponent } from 'twenty-sdk/define';
import {
  AppPath,
  Command,
  navigate,
  useSelectedRecordIds,
} from 'twenty-sdk/front-component';

import { transformarIdeiasEmProjeto } from 'src/modules/projetos/actions/transformar-ideias-em-projeto';
import { TRANSFORMAR_IDEIAS_FRONT_COMPONENT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { runBulkIdeiaAction } from 'src/modules/projetos/front-components/utils/run-bulk-ideia-action.util';

const TransformarIdeiasEmProjeto = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={async () => {
        const result = await runBulkIdeiaAction({
          action: (client) => transformarIdeiasEmProjeto(client, recordIds, Date.now()),
          successLabel: (count) => (count === 1 ? 'Projeto criado' : `${count} projetos criados`),
        });

        const created = result?.results.filter((item) => item.status === 'SUCCESS') ?? [];

        // Com uma única ideia, leva direto ao projeto recém-criado.
        if (recordIds.length === 1 && created.length === 1 && created[0].projetoId) {
          await navigate(AppPath.RecordShowPage, {
            objectNameSingular: 'projeto',
            objectRecordId: created[0].projetoId,
          });
        }
      }}
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: TRANSFORMAR_IDEIAS_FRONT_COMPONENT_ID,
  name: 'transformar-ideias-em-projeto',
  description: 'Cria projetos a partir das ideias selecionadas e liga cada ideia ao seu projeto',
  component: TransformarIdeiasEmProjeto,
  isHeadless: true,
});
