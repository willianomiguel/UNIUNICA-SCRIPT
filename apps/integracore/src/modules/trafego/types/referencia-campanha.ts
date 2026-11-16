// Como uma métrica recebida aponta para a campanha: qualquer um dos campos serve.
export type ReferenciaCampanha = {
  id?: string;
  idExterno?: string;
  utmCampaign?: string;
  nome?: string;
};
