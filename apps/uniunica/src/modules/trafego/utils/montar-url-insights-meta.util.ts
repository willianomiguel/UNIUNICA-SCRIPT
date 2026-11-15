import { META_GRAPH_API_VERSAO } from 'src/modules/trafego/constants/trafego-constantes';

// URL do relatório diário por campanha da Graph API (o token vai no cabeçalho, não na URL).
export const montarUrlInsightsMeta = ({
  idConta,
  desde,
  ate,
}: {
  idConta: string;
  desde: string;
  ate: string;
}): string => {
  const parametros = new URLSearchParams({
    level: 'campaign',
    time_increment: '1',
    fields:
      'campaign_id,campaign_name,spend,impressions,clicks,inline_link_clicks,actions,date_start,date_stop',
    time_range: JSON.stringify({ since: desde, until: ate }),
    limit: '500',
  });

  return `https://graph.facebook.com/${META_GRAPH_API_VERSAO}/${idConta}/insights?${parametros.toString()}`;
};
