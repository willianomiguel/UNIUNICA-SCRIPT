import { type RestApiClient } from 'twenty-client-sdk/rest';

import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { calcularProximoNumeroTarefa } from 'src/modules/sprints/utils/calcular-proximo-numero-tarefa.util';
import { extrairNumeroCodigo } from 'src/modules/sprints/utils/extrair-numero-codigo.util';
import { formatarCodigoTarefa } from 'src/modules/sprints/utils/formatar-codigo-tarefa.util';

// Calcula o próximo número/código livre (UNI-<n>) a partir da tarefa
// com o maior número sequencial.
export const gerarProximoCodigoTarefa = async (
  cliente: RestApiClient,
): Promise<{ numero: number; codigo: string }> => {
  const resposta = await cliente.get<{ data?: { tasks?: TarefaSprint[] } }>(
    '/rest/tasks',
    {
      query: {
        order_by: 'numero[DescNullsLast]',
        filter: 'numero[is]:NOT_NULL',
        limit: 1,
        depth: 0,
      },
    },
  );
  const maior = resposta.data?.tasks?.[0];
  const numero = calcularProximoNumeroTarefa([
    maior?.numero,
    extrairNumeroCodigo(maior?.codigo),
  ]);

  return { numero, codigo: formatarCodigoTarefa(numero) };
};
