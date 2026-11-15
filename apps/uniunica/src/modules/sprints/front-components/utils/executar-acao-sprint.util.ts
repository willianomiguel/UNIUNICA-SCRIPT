import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';
import { formatarMensagemAcaoSprint } from 'src/modules/sprints/utils/formatar-mensagem-acao-sprint.util';

type RespostaAcao = {
  ok: boolean;
  sucesso: number;
  ignoradas: number;
  falhas: number;
  resultados: ResultadoAcaoSprint[];
};

// Chama a rota de iniciar/encerrar sprints (uma chamada em lote) e mostra o resultado.
export const executarAcaoSprint = async ({
  rota,
  verbo,
  sprintIds,
}: {
  rota: '/s/sprints/iniciar' | '/s/sprints/encerrar';
  verbo: 'iniciada' | 'encerrada';
  sprintIds: string[];
}): Promise<void> => {
  if (sprintIds.length === 0) {
    await enqueueSnackbar({ message: 'Selecione ao menos uma sprint', variant: 'warning' });

    return;
  }

  const resposta = await new RestApiClient().post<RespostaAcao>(rota, {
    records: sprintIds.map((id) => ({ id })),
  });

  await enqueueSnackbar({
    message: formatarMensagemAcaoSprint(verbo, {
      ...resposta,
      mensagens: resposta.resultados.map((r) => r.mensagem),
    }),
    variant: resposta.falhas > 0 ? 'error' : resposta.sucesso > 0 ? 'success' : 'info',
  });
};
