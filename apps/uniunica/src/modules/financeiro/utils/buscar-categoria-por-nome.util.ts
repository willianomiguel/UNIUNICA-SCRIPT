import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';

type RespostaLista = { data?: { categoriasFinanceiras?: Array<{ id: string }> } };

// ID da categoria financeira com o nome exato, ou null se não existir.
export const buscarCategoriaPorNome = async (
  cliente: ClienteRest,
  nome: string,
): Promise<string | null> => {
  const resposta = await cliente.get<RespostaLista>('/rest/categoriasFinanceiras', {
    query: { limit: 1, filter: `nome[eq]:${JSON.stringify(nome)}` },
  });

  return resposta.data?.categoriasFinanceiras?.[0]?.id ?? null;
};
