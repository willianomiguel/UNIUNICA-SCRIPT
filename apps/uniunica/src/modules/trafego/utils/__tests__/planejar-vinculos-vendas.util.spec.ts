import { planejarVinculosVendas } from 'src/modules/trafego/utils/planejar-vinculos-vendas.util';

const campanhas = [
  { id: 'c1', nome: 'BF', plataforma: null, status: null, utmCampaign: 'black-friday', idExterno: null },
];

describe('planejarVinculosVendas', () => {
  it('liga só vendas sem campanha com utm correspondente', () => {
    expect(
      planejarVinculosVendas(
        [
          { id: 'v1', campanhaId: null, utmCampaign: 'Black-Friday' },
          { id: 'v2', campanhaId: 'outra', utmCampaign: 'black-friday' },
          { id: 'v3', campanhaId: null, utmCampaign: null },
          { id: 'v4', campanhaId: null, utmCampaign: 'desconhecida' },
        ],
        campanhas,
      ),
    ).toEqual([{ vendaId: 'v1', campanhaId: 'c1' }]);
  });
});
