// Contrato compartilhado entre os módulos da UniÚnica.
// IDs universais (universalIdentifier) e nomes de API de TODOS os objetos customizados.
// NUNCA altere um ID depois do primeiro sync: o Twenty usa esses IDs para identificar os dados.
// Cada objeto pertence a UM módulo (campo `module`); só esse módulo cria o arquivo defineObject.
// Outros módulos podem referenciar o ID para criar relações (ver docs/CONTRATO-MODULOS.md).
export const OBJECTS = {
  venda: {
    module: 'vendas',
    universalIdentifier: '30ee57c7-53f0-41ce-b2cb-ad7b6929b17b',
    nameSingular: 'venda',
    namePlural: 'vendas',
  },
  eventoPagamento: {
    module: 'vendas',
    universalIdentifier: 'de54deea-be9d-4fc1-a1e5-13433dd50460',
    nameSingular: 'eventoPagamento',
    namePlural: 'eventosPagamento',
  },
  lancamento: {
    module: 'financeiro',
    universalIdentifier: 'd433171b-1521-434b-b476-58b00df186ac',
    nameSingular: 'lancamento',
    namePlural: 'lancamentos',
  },
  categoriaFinanceira: {
    module: 'financeiro',
    universalIdentifier: '68b639a9-6dcc-40c0-97fe-f9dade9e74c2',
    nameSingular: 'categoriaFinanceira',
    namePlural: 'categoriasFinanceiras',
  },
  meta: {
    module: 'metas',
    universalIdentifier: '6fd63830-eec4-4b1c-b571-6e72695fd8aa',
    nameSingular: 'meta',
    namePlural: 'metas',
  },
  campanha: {
    module: 'trafego',
    universalIdentifier: 'b47e7461-cc91-443f-8b78-e45bc6a40850',
    nameSingular: 'campanha',
    namePlural: 'campanhas',
  },
  metricaTrafego: {
    module: 'trafego',
    universalIdentifier: '09f124f9-4de1-4e6e-9b14-ada55471b859',
    nameSingular: 'metricaTrafego',
    namePlural: 'metricasTrafego',
  },
  projeto: {
    module: 'projetos',
    universalIdentifier: 'b3413c8b-b312-414e-b06e-9c65db96290d',
    nameSingular: 'projeto',
    namePlural: 'projetos',
  },
  ideia: {
    module: 'projetos',
    universalIdentifier: '88d81547-880f-4321-9d15-6d3a023843d1',
    nameSingular: 'ideia',
    namePlural: 'ideias',
  },
  sprint: {
    module: 'sprints',
    universalIdentifier: '62741498-7aad-4978-a3a2-0bba03f5a7cb',
    nameSingular: 'sprint',
    namePlural: 'sprints',
  },
  documento: {
    module: 'docs',
    universalIdentifier: '9a724747-c031-471a-af63-033dcc98bec2',
    nameSingular: 'documento',
    namePlural: 'documentos',
  },
  alerta: {
    module: 'avisos',
    universalIdentifier: '5f2bef8a-3633-4288-a3ef-432bfde21a03',
    nameSingular: 'alerta',
    namePlural: 'alertas',
  },
  quadro: {
    module: 'quadros',
    universalIdentifier: '4b427a2c-b44d-4fca-9b18-e420cb163d60',
    nameSingular: 'quadro',
    namePlural: 'quadros',
  },
  cofre: {
    module: 'cofre',
    universalIdentifier: '8d61259b-fd4d-43e0-91c2-7855b2537d41',
    nameSingular: 'cofre',
    namePlural: 'cofres',
  },
} as const;
