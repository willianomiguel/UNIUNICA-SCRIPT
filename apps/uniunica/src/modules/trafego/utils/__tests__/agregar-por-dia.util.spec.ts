import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { agregarPorDia } from 'src/modules/trafego/utils/agregar-por-dia.util';

const linha = (data: string | null, gasto: number): LinhaMetrica => ({
  data,
  campanhaId: null,
  origem: null,
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto,
});

describe('agregarPorDia', () => {
  it('soma por dia, ordena e ignora linhas sem data', () => {
    const serie = agregarPorDia([
      linha('2026-11-12', 5),
      linha('2026-11-10T00:00:00Z', 1),
      linha('2026-11-10', 2),
      linha(null, 100),
    ]);

    expect(serie.map((item) => [item.data, item.totais.gasto])).toEqual([
      ['2026-11-10', 3],
      ['2026-11-12', 5],
    ]);
  });
});
