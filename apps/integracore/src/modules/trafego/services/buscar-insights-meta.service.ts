import { type MetaInsightLinha } from 'src/modules/trafego/types/meta-insight-linha';
import { montarUrlInsightsMeta } from 'src/modules/trafego/utils/montar-url-insights-meta.util';

const MAX_PAGINAS = 50;

// Busca o relatório diário por campanha na Graph API, seguindo a paginação.
export const buscarInsightsMeta = async ({
  token,
  idConta,
  desde,
  ate,
}: {
  token: string;
  idConta: string;
  desde: string;
  ate: string;
}): Promise<{ data: MetaInsightLinha[] }> => {
  const linhas: MetaInsightLinha[] = [];
  let url: string | undefined = montarUrlInsightsMeta({ idConta, desde, ate });
  let paginas = 0;

  while (url && paginas < MAX_PAGINAS) {
    const resposta = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const corpo = (await resposta.json().catch(() => ({}))) as {
      data?: MetaInsightLinha[];
      paging?: { next?: string };
      error?: { message?: string };
    };

    if (!resposta.ok) {
      throw new Error(
        `Meta Ads respondeu ${resposta.status}: ${corpo.error?.message ?? 'erro desconhecido'}`,
      );
    }

    linhas.push(...(corpo.data ?? []));
    url = corpo.paging?.next;
    paginas += 1;
  }

  return { data: linhas };
};
