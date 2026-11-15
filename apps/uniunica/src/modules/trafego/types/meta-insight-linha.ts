// Linha de /act_<id>/insights?level=campaign&time_increment=1 da Graph API do Meta.
export type MetaInsightLinha = {
  campaign_id?: string;
  campaign_name?: string;
  date_start?: string;
  date_stop?: string;
  spend?: string | number;
  impressions?: string | number;
  clicks?: string | number;
  inline_link_clicks?: string | number;
  actions?: Array<{ action_type?: string; value?: string | number }>;
};
