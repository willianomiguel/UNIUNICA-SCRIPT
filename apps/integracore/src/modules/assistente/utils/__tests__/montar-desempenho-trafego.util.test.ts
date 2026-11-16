import { describe, expect, it } from 'vitest';

import { calcularRoi } from 'src/modules/assistente/utils/calcular-roi.util';
import { montarDesempenhoTrafego } from 'src/modules/assistente/utils/montar-desempenho-trafego.util';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';

const metrica = (dados: Partial<LinhaMetrica>): LinhaMetrica => ({
  data: '2026-11-10',
  campanhaId: 'c1',
  origem: 'META_ADS',
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto: 0,
  ...dados,
});

const campanhas = [
  { id: 'c1', nome: 'Black Friday', plataforma: 'META_ADS', status: 'ATIVA', utmCampaign: null, idExterno: null },
  { id: 'c2', nome: 'Orgânico', plataforma: 'ORGANICO', status: 'ATIVA', utmCampaign: null, idExterno: null },
];
const intervalo = { inicio: '2026-11-01', fim: '2026-11-30' };

describe('calcularRoi', () => {
  it('é (receita - gasto) / gasto e null com gasto zero', () => {
    expect(calcularRoi(300, 100)).toBe(2);
    expect(calcularRoi(50, 100)).toBe(-0.5);
    expect(calcularRoi(100, 0)).toBeNull();
    expect(calcularRoi(0, 0)).toBeNull();
  });
});

describe('montarDesempenhoTrafego', () => {
  it('período vazio dá zeros e nulos sem erro', () => {
    const resultado = montarDesempenhoTrafego({ campanhas, metricas: [], vendas: [], intervalo, campanhaBusca: null });

    expect(resultado.total).toEqual({ gasto: 0, receita: 0, vendas: 0, roas: null, roi: null, cpa: null });
    expect(resultado.campanhas).toEqual([]);
  });

  it('calcula ROAS, ROI e CPA por campanha e no total; ROI null sem gasto', () => {
    const resultado = montarDesempenhoTrafego({
      campanhas,
      metricas: [
        metrica({ gasto: 100 }),
        metrica({ gasto: 100, data: '2026-10-01' }),
        metrica({ campanhaId: 'c2', gasto: 0 }),
      ],
      vendas: [
        { id: 'v1', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 250 },
        { id: 'v2', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 50 },
        { id: 'v3', campanhaId: 'c2', utmCampaign: null, status: 'APROVADA', valor: 40 },
      ],
      intervalo,
      campanhaBusca: null,
    });
    const black = resultado.campanhas.find((linha) => linha.campanhaId === 'c1');
    const organico = resultado.campanhas.find((linha) => linha.campanhaId === 'c2');

    expect(black).toMatchObject({ gasto: 100, receita: 300, vendas: 2, roas: 3, roi: 2, cpa: 50 });
    expect(organico).toMatchObject({ gasto: 0, receita: 40, roas: null, roi: null });
    expect(resultado.total).toMatchObject({ gasto: 100, receita: 340, vendas: 3, roi: 2.4 });
  });

  it('filtra por texto no nome da campanha', () => {
    const resultado = montarDesempenhoTrafego({
      campanhas,
      metricas: [metrica({ gasto: 10 }), metrica({ campanhaId: 'c2', gasto: 5 })],
      vendas: [],
      intervalo,
      campanhaBusca: 'organico',
    });

    expect(resultado.campanhas).toHaveLength(1);
    expect(resultado.total.gasto).toBe(5);
  });
});
