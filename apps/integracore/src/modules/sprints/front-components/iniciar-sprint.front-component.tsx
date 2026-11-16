import { defineFrontComponent } from 'integra-sdk/define';
import { CommandModal, useSelectedRecordIds } from 'integra-sdk/front-component';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { executarAcaoSprint } from 'src/modules/sprints/front-components/utils/executar-acao-sprint.util';

const IniciarSprint = () => {
  const sprintIds = useSelectedRecordIds();

  return (
    <CommandModal
      title="Iniciar sprint?"
      subtitle="A sprint passa a ser a ativa e o burndown começa a ser registrado."
      confirmButtonText="Iniciar"
      confirmButtonAccent="blue"
      execute={() =>
        executarAcaoSprint({ rota: '/s/sprints/iniciar', verbo: 'iniciada', sprintIds })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: SPRINTS_IDS.frontComponents.iniciarSprint,
  name: 'sprints-iniciar-sprint',
  description: 'Iniciar as sprints selecionadas',
  isHeadless: true,
  component: IniciarSprint,
});
