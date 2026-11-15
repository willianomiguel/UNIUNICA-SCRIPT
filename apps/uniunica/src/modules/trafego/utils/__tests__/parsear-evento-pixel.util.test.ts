import { parsearEventoPixel } from 'src/modules/trafego/utils/parsear-evento-pixel.util';

describe('parsearEventoPixel', () => {
  it('lê a query string do GET', () => {
    expect(
      parsearEventoPixel({
        queryStringParameters: { pagina: '/oferta', tipo: 'clique', utm_campaign: 'BF', utm_source: 'ig' },
      }),
    ).toEqual({ pagina: '/oferta', tipo: 'CLIQUE', utmCampaign: 'bf', utmSource: 'ig', utmMedium: null });
  });

  it('lê corpo JSON ou texto do POST/sendBeacon', () => {
    expect(parsearEventoPixel({ body: { page: '/a' } })?.tipo).toBe('VISITA');
    expect(parsearEventoPixel({ body: '{"pagina":"/b","tipo":"click"}' })).toMatchObject({
      pagina: '/b',
      tipo: 'CLIQUE',
    });
    expect(parsearEventoPixel({ body: 'pagina=%2Fc&utm_campaign=x' })).toMatchObject({
      pagina: '/c',
      utmCampaign: 'x',
    });
  });

  it('usa o referer quando não vem página', () => {
    expect(parsearEventoPixel({ headers: { referer: 'https://site.com/lp?x=1' } })?.pagina).toBe('site.com/lp');
  });

  it('sem página devolve null', () => {
    expect(parsearEventoPixel({})).toBeNull();
  });
});
