import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';

type RespostaLista = { data?: { lancamentos?: unknown[] } };

export const existeLancamentoComChave = async (
  cliente: ClienteRest,
  chave: string,
): Promise<boolean> => {
  const resposta = await cliente.get<RespostaLista>('/rest/lancamentos', {
    query: {
      limit: 1,
      filter: `chaveIdempotencia[eq]:${JSON.stringify(chave)}`,
    },
  });

  return (resposta.data?.lancamentos?.length ?? 0) > 0;
};
