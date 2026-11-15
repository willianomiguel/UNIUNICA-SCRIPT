import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { agregarPorPlataforma } from 'src/modules/trafego/utils/agregar-por-plataforma.util';

const linha = (campanhaId: string | null, origem: string | null, gasto: number): LinhaMetrica => ({
  data: '2026-11-10',
  campanhaId,
  origem,
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto,
});

describe('agregarPorPlataforma', () => {
  it('usa a plataforma da campanha, depois a origem, depois OUTRO', () => {
    const grupos = agregarPorPlataforma(
      [
        linha('c1', 'MANUAL', 10),
        linha('c2', 'META_ADS', 5),
        linha(null, 'SITE', 0),
        linha(null, null, 1),
        linha('desconhecida', 'GOOGLE_ADS', 2),
      ],
      { c1: 'META_ADS', c2: 'META_ADS' },
    );

    expect(grupos.META_ADS.gasto).toBe(15);
    expect(grupos.SITE.gasto).toBe(0);
    expect(grupos.OUTRO.gasto).toBe(1);
    expect(grupos.GOOGLE_ADS.gasto).toBe(2);
  });
});
