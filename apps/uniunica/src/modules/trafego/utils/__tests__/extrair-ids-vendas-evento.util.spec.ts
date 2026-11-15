import { extrairIdsVendasEvento } from 'src/modules/trafego/utils/extrair-ids-vendas-evento.util';

describe('extrairIdsVendasEvento', () => {
  it('lê eventos em lote e filtra vendas sem campanha com utm', () => {
    expect(
      extrairIdsVendasEvento({
        events: [
          { recordId: 'v1', properties: { after: { id: 'v1', utmCampaign: 'bf', campanhaId: null } } },
          { recordId: 'v2', properties: { after: { id: 'v2', utmCampaign: 'bf', campanhaId: 'c1' } } },
          { recordId: 'v3', properties: { after: { id: 'v3', utmCampaign: null } } },
          { recordId: 'v1', properties: { after: { id: 'v1', utmCampaign: 'bf' } } },
          { recordId: 'v4', properties: { before: { id: 'v4' } } },
        ],
      }),
    ).toEqual(['v1']);
  });
  it('aceita evento único e usa recordId quando o after não tem id', () => {
    expect(extrairIdsVendasEvento({ recordId: 'v9', properties: { after: { utmCampaign: 'x' } } })).toEqual(['v9']);
  });
  it('payload inválido devolve lista vazia', () => {
    expect(extrairIdsVendasEvento(null)).toEqual([]);
    expect(extrairIdsVendasEvento('x')).toEqual([]);
  });
});
