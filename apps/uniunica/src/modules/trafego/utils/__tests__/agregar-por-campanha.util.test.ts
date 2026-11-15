import { SEM_CAMPANHA } from 'src/modules/trafego/constants/trafego-constantes';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { agregarPorCampanha } from 'src/modules/trafego/utils/agregar-por-campanha.util';

const linha = (campanhaId: string | null, leads: number): LinhaMetrica => ({
  data: '2026-11-10',
  campanhaId,
  origem: null,
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads,
  conversoes: 0,
  gasto: 0,
});

describe('agregarPorCampanha', () => {
  it('soma por campanha e junta as sem campanha', () => {
    const grupos = agregarPorCampanha([linha('c1', 2), linha('c1', 3), linha(null, 7)]);

    expect(grupos.c1.leads).toBe(5);
    expect(grupos[SEM_CAMPANHA].leads).toBe(7);
  });
});
