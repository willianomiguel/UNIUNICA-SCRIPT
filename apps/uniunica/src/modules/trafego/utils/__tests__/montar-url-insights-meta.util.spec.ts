import { montarUrlInsightsMeta } from 'src/modules/trafego/utils/montar-url-insights-meta.util';

describe('montarUrlInsightsMeta', () => {
  it('monta a URL de insights por campanha e dia, sem token', () => {
    const url = new URL(montarUrlInsightsMeta({ idConta: 'act_1', desde: '2026-11-10', ate: '2026-11-14' }));

    expect(url.origin).toBe('https://graph.facebook.com');
    expect(url.pathname).toMatch(/^\/v\d+\.\d+\/act_1\/insights$/);
    expect(url.searchParams.get('level')).toBe('campaign');
    expect(url.searchParams.get('time_increment')).toBe('1');
    expect(JSON.parse(url.searchParams.get('time_range') ?? '{}')).toEqual({
      since: '2026-11-10',
      until: '2026-11-14',
    });
    expect(url.searchParams.get('fields')).toContain('actions');
    expect(url.searchParams.has('access_token')).toBe(false);
  });
});
