// Venda lida do banco para cruzar com tráfego (valor em reais).
export type VendaResumo = {
  id: string;
  campanhaId: string | null;
  utmCampaign: string | null;
  status: string | null;
  valor: number;
};
