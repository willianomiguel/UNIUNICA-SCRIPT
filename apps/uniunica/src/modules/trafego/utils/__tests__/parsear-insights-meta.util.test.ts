import { describe, expect, it } from 'vitest';

import { parsearInsightsMeta } from 'src/modules/trafego/utils/parsear-insights-meta.util';

describe('parsearInsightsMeta', () => {
  it('converte linhas diárias por campanha', () => {
    const { metricas, erros } = parsearInsightsMeta({
      data: [
        {
          campaign_id: '120210',
          campaign_name: 'Black Friday',
          date_start: '2026-11-14',
          date_stop: '2026-11-14',
          spend: '123.45',
          impressions: '10000',
          clicks: '300',
          inline_link_clicks: '210',
          actions: [
            { action_type: 'lead', value: '12' },
            { action_type: 'landing_page_view', value: '180' },
            { action_type: 'purchase', value: '2' },
          ],
        },
      ],
      paging: {},
    });

    expect(erros).toEqual([]);
    expect(metricas[0]).toEqual({
      chave: 'meta:120210:2026-11-14',
      data: '2026-11-14',
      origem: 'META_ADS',
      impressoes: 10000,
      cliques: 210,
      visitas: 180,
      leads: 12,
      conversoes: 2,
      gasto: 123.45,
      pagina: null,
      campanha: { idExterno: '120210', nome: 'Black Friday' },
    });
  });

  it('sem inline_link_clicks usa clicks e sem ações zera leads', () => {
    const { metricas } = parsearInsightsMeta({
      data: [{ campaign_id: '1', date_start: '2026-11-14', clicks: '7', spend: '1' }],
    });

    expect(metricas[0].cliques).toBe(7);
    expect(metricas[0].leads).toBe(0);
  });

  it('linhas incompletas viram erro e resposta inválida é sinalizada', () => {
    expect(parsearInsightsMeta({ data: [{ spend: '1' }] }).erros).toHaveLength(1);
    expect(parsearInsightsMeta({ error: { message: 'x' } }).erros).toHaveLength(1);
    expect(parsearInsightsMeta({ data: [] })).toEqual({ metricas: [], erros: [] });
  });
});
