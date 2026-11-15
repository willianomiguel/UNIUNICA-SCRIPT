import { describe, expect, it } from 'vitest';

import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { montarLinhasPainel } from 'src/modules/trafego/utils/montar-linhas-painel.util';

const linha = (campanhaId: string | null, gasto: number, cliques = 0): LinhaMetrica => ({
  data: '2026-11-10',
  campanhaId,
  origem: 'META_ADS',
  impressoes: 1000,
  cliques,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto,
});

const campanha = (id: string, nome: string) => ({
  id,
  nome,
  plataforma: 'META_ADS',
  status: 'ATIVA',
  utmCampaign: null,
  idExterno: null,
});

describe('montarLinhasPainel', () => {
  it('cruza métricas e vendas por campanha, ordenado por gasto', () => {
    const linhas = montarLinhasPainel({
      campanhas: [campanha('c1', 'Black Friday'), campanha('c2', 'Marca'), campanha('c3', 'Só vendas')],
      metricas: [linha('c1', 100, 50), linha('c2', 300), linha(null, 0, 10)],
      vendas: [
        { id: 'v1', campanhaId: 'c1', utmCampaign: null, status: 'APROVADA', valor: 500 },
        { id: 'v2', campanhaId: 'c3', utmCampaign: null, status: 'APROVADA', valor: 80 },
      ],
    });

    expect(linhas.map((item) => item.nome)).toEqual([
      'Marca',
      'Black Friday',
      'Só vendas',
      'Sem campanha (site/orgânico)',
    ]);

    const blackFriday = linhas[1];

    expect(blackFriday.receita).toBe(500);
    expect(blackFriday.vendas).toBe(1);
    expect(blackFriday.indicadores.roas).toBe(5);
    expect(blackFriday.indicadores.cpa).toBe(100);
    expect(linhas[2].indicadores.roas).toBeNull();
    expect(linhas[3].campanhaId).toBeNull();
  });

  it('sem dados devolve lista vazia', () => {
    expect(montarLinhasPainel({ campanhas: [], metricas: [], vendas: [] })).toEqual([]);
  });
});
