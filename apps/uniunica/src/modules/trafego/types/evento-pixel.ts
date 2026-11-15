export type EventoPixel = {
  pagina: string;
  tipo: 'VISITA' | 'CLIQUE';
  utmCampaign: string | null;
  utmSource: string | null;
  utmMedium: string | null;
};
