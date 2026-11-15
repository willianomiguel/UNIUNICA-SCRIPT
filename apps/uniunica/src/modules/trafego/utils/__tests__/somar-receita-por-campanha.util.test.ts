import { describe, expect, it } from 'vitest';

import { somarReceitaPorCampanha } from 'src/modules/trafego/utils/somar-receita-por-campanha.util';

describe('somarReceitaPorCampanha', () => {
  it('soma só vendas APROVADAS com campanha', () => {
    expect(
      somarReceitaPorCampanha([
        { id: '1', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 100 },
        { id: '2', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 50 },
        { id: '3', campanhaId: 'c1', utmCampaign: null, status: 'RECUSADA', valor: 999 },
        { id: '4', campanhaId: null, utmCampaign: 'x', status: 'APROVADA', valor: 999 },
      ]),
    ).toEqual({ c1: { receita: 150, vendas: 2 } });
  });
});
