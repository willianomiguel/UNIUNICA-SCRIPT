import { mapearNoVenda } from 'src/modules/trafego/utils/mapear-no-venda.util';

describe('mapearNoVenda', () => {
  it('converte valor de micros', () => {
    expect(
      mapearNoVenda({ id: 'v1', campanhaId: 'c1', status: 'APROVADA', valor: { amountMicros: 197_000_000 } }),
    ).toEqual({ id: 'v1', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 197 });
  });
  it('sem valor vira 0', () => expect(mapearNoVenda({ id: 'v2', valor: null }).valor).toBe(0));
});
