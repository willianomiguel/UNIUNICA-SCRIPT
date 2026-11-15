import { mapearMetricaParaRegistro } from 'src/modules/trafego/utils/mapear-metrica-para-registro.util';

const metrica = {
  chave: 'meta:1:2026-11-14',
  data: '2026-11-14',
  origem: 'META_ADS' as const,
  impressoes: 100,
  cliques: 10,
  visitas: 8,
  leads: 2,
  conversoes: 1,
  gasto: 12.34,
  pagina: null,
  campanha: { idExterno: '1' },
};

describe('mapearMetricaParaRegistro', () => {
  it('monta os dados com gasto em micros BRL e campanha', () => {
    expect(mapearMetricaParaRegistro(metrica, { id: 'c1', nome: 'BF' })).toEqual({
      nome: 'Meta Ads · BF · 2026-11-14',
      data: '2026-11-14',
      origem: 'META_ADS',
      impressoes: 100,
      cliques: 10,
      visitas: 8,
      leads: 2,
      conversoes: 1,
      gasto: { amountMicros: 12_340_000, currencyCode: 'BRL' },
      pagina: null,
      chave: 'meta:1:2026-11-14',
      campanhaId: 'c1',
    });
  });
  it('sem campanha não envia campanhaId (não apaga vínculo manual)', () => {
    expect(mapearMetricaParaRegistro(metrica, null)).not.toHaveProperty('campanhaId');
  });
});
