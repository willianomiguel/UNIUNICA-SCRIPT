import { type ResultadoPontosSprint } from 'src/modules/sprints/types/resultado-pontos-sprint';
import { type TarefaPontuada } from 'src/modules/sprints/types/tarefa-pontuada';

const pontosValidos = (pontos: number | null | undefined): number =>
  typeof pontos === 'number' && Number.isFinite(pontos) && pontos > 0
    ? pontos
    : 0;

// Soma os pontos das tarefas da sprint e os pontos das concluídas (DONE).
export const calcularPontosSprint = (
  tarefas: TarefaPontuada[],
): ResultadoPontosSprint =>
  tarefas.reduce<ResultadoPontosSprint>(
    (acumulado, tarefa) => {
      const pontos = pontosValidos(tarefa.pontos);

      return {
        pontosTotais: acumulado.pontosTotais + pontos,
        pontosConcluidos:
          acumulado.pontosConcluidos + (tarefa.status === 'DONE' ? pontos : 0),
      };
    },
    { pontosTotais: 0, pontosConcluidos: 0 },
  );
