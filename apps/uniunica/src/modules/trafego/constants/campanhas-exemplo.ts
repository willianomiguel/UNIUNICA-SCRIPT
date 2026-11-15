// Campanhas de exemplo criadas pelo seed (identificadas pelo idExterno "exemplo-…").
export const CAMPANHAS_EXEMPLO = [
  {
    nome: 'Black Friday 2026 — Meta Ads',
    plataforma: 'META_ADS',
    origem: 'META_ADS',
    status: 'ATIVA',
    objetivo: 'Vendas',
    orcamento: 3000,
    utmCampaign: 'black-friday-2026',
    idExterno: 'exemplo-meta-black-friday',
    link: 'https://uniunica.com.br/black-friday',
    base: { impressoes: 9000, cliques: 180, visitas: 150, leads: 14, conversoes: 3, gasto: 160 },
  },
  {
    nome: 'Pesquisa de marca — Google Ads',
    plataforma: 'GOOGLE_ADS',
    origem: 'GOOGLE_ADS',
    status: 'ATIVA',
    objetivo: 'Leads',
    orcamento: 1500,
    utmCampaign: 'google-marca',
    idExterno: 'exemplo-google-marca',
    link: 'https://uniunica.com.br',
    base: { impressoes: 2500, cliques: 120, visitas: 105, leads: 9, conversoes: 2, gasto: 75 },
  },
] as const;
