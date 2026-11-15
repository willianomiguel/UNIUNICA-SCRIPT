import { defineFrontComponent } from 'twenty-sdk/define';
import { CommandModal, useSelectedRecordIds } from 'twenty-sdk/front-component';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { executarAcaoSprint } from 'src/modules/sprints/front-components/utils/executar-acao-sprint.util';

const EncerrarSprint = () => {
  const sprintIds = useSelectedRecordIds();

  return (
    <CommandModal
      title="Encerrar sprint?"
      subtitle="As tarefas não concluídas vão para a próxima sprint planejada (ou para o backlog) e a sprint é marcada como concluída."
      confirmButtonText="Encerrar"
      confirmButtonAccent="danger"
      execute={() =>
        executarAcaoSprint({ rota: '/s/sprints/encerrar', verbo: 'encerrada', sprintIds })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: SPRINTS_IDS.frontComponents.encerrarSprint,
  name: 'sprints-encerrar-sprint',
  description: 'Encerrar as sprints selecionadas',
  isHeadless: true,
  component: EncerrarSprint,
});
