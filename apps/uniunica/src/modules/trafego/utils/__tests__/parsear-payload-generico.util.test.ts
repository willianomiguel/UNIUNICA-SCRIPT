import { describe, expect, it } from 'vitest';

import { parsearPayloadGenerico } from 'src/modules/trafego/utils/parsear-payload-generico.util';

describe('parsearPayloadGenerico', () => {
  it('lê o formato documentado', () => {
    const { metricas, erros } = parsearPayloadGenerico({
      origem: 'GOOGLE_ADS',
      metricas: [
        {
          data: '2026-11-14',
          campanha: { idExterno: '123', nome: 'Marca' },
          impressoes: 1000,
          cliques: 40,
          visitas: 30,
          leads: 4,
          conversoes: 1,
          gasto: 87.5,
        },
      ],
    });

    expect(erros).toEqual([]);
    expect(metricas).toEqual([
      {
        chave: 'google:123:2026-11-14',
        data: '2026-11-14',
        origem: 'GOOGLE_ADS',
        impressoes: 1000,
        cliques: 40,
        visitas: 30,
        leads: 4,
        conversoes: 1,
        gasto: 87.5,
        pagina: null,
        campanha: { idExterno: '123', nome: 'Marca' },
      },
    ]);
  });

  it('aceita array solto, apelidos em inglês, campos planos e chave própria', () => {
    const { metricas } = parsearPayloadGenerico([
      {
        date: '14/11/2026',
        origem: 'tiktok',
        utm_campaign: 'bf',
        impressions: '2000',
        clicks: '12',
        cost: '10,5',
        chave: 'minha-chave',
      },
    ]);

    expect(metricas[0]).toMatchObject({
      chave: 'minha-chave',
      data: '2026-11-14',
      origem: 'TIKTOK_ADS',
      impressoes: 2000,
      cliques: 12,
      gasto: 10.5,
      campanha: { utmCampaign: 'bf' },
    });
  });

  it('linha repetida na mesma chave fica só a última', () => {
    const { metricas } = parsearPayloadGenerico({
      metricas: [
        { data: '2026-11-14', idExterno: '1', gasto: 1 },
        { data: '2026-11-14', idExterno: '1', gasto: 2 },
      ],
    });

    expect(metricas).toHaveLength(1);
    expect(metricas[0].gasto).toBe(2);
    expect(metricas[0].origem).toBe('MANUAL');
  });

  it('reporta linhas inválidas sem descartar as boas', () => {
    const { metricas, erros } = parsearPayloadGenerico({
      metricas: [{ data: 'ontem' }, 'texto', { data: '2026-11-14', pagina: '/oferta' }],
    });

    expect(metricas).toHaveLength(1);
    expect(metricas[0].chave).toBe('manual:/oferta:2026-11-14');
    expect(metricas[0].campanha).toBeNull();
    expect(erros).toHaveLength(2);
  });

  it('corpo sem lista devolve erro', () => {
    expect(parsearPayloadGenerico(null).erros).toHaveLength(1);
    expect(parsearPayloadGenerico({ foo: 1 }).metricas).toEqual([]);
  });

  it('limita o tamanho do envio', () => {
    const linhas = Array.from({ length: 2001 }, () => ({ data: '2026-11-14' }));

    expect(parsearPayloadGenerico(linhas).erros[0]).toContain('Máximo');
  });
});
