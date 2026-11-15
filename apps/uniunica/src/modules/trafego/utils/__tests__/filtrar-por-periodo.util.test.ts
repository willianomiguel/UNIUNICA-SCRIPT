import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { filtrarPorPeriodo } from 'src/modules/trafego/utils/filtrar-por-periodo.util';

const linha = (data: string | null): LinhaMetrica => ({
  data,
  campanhaId: null,
  origem: null,
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto: 0,
});

describe('filtrarPorPeriodo', () => {
  const linhas = [linha('2026-11-01'), linha('2026-11-10'), linha('2026-11-20'), linha(null)];

  it('filtra inclusive nas pontas e descarta sem data', () => {
    expect(filtrarPorPeriodo(linhas, '2026-11-01', '2026-11-10').map((item) => item.data)).toEqual([
      '2026-11-01',
      '2026-11-10',
    ]);
  });
  it('pontas nulas não limitam', () => {
    expect(filtrarPorPeriodo(linhas, null, null)).toHaveLength(3);
    expect(filtrarPorPeriodo(linhas, '2026-11-15', null)).toHaveLength(1);
  });
});
