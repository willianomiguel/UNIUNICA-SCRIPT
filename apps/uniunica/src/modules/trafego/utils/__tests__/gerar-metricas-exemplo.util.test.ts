import { gerarMetricasExemplo } from 'src/modules/trafego/utils/gerar-metricas-exemplo.util';

const base = { impressoes: 1000, cliques: 100, visitas: 80, leads: 10, conversoes: 2, gasto: 50 };

describe('gerarMetricasExemplo', () => {
  it('gera N dias antes de hoje com chaves estáveis', () => {
    const metricas = gerarMetricasExemplo({ idExterno: 'ex-1', origem: 'META_ADS', base, hoje: '2026-11-15', dias: 14 });

    expect(metricas).toHaveLength(14);
    expect(metricas[0].data).toBe('2026-11-01');
    expect(metricas[13].data).toBe('2026-11-14');
    expect(metricas[0].chave).toBe('meta:ex-1:2026-11-01');
    expect(new Set(metricas.map((item) => item.chave)).size).toBe(14);
    expect(metricas.every((item) => item.campanha?.idExterno === 'ex-1')).toBe(true);
  });
  it('é determinístico', () => {
    const args = { idExterno: 'x', origem: 'GOOGLE_ADS' as const, base, hoje: '2026-11-15', dias: 3 };

    expect(gerarMetricasExemplo(args)).toEqual(gerarMetricasExemplo(args));
  });
});
