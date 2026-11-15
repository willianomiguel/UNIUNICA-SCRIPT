import { mapearNoCampanha } from 'src/modules/trafego/utils/mapear-no-campanha.util';

describe('mapearNoCampanha', () => {
  it('mapeia o nó GraphQL e preenche ausentes com null', () => {
    expect(mapearNoCampanha({ id: 'c1', nome: 'BF', plataforma: 'META_ADS' })).toEqual({
      id: 'c1',
      nome: 'BF',
      plataforma: 'META_ADS',
      status: null,
      utmCampaign: null,
      idExterno: null,
    });
  });
});
