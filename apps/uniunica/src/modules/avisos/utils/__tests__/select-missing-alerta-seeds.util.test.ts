import { describe, expect, it } from 'vitest';

import { AVISOS_SEED_ALERTAS } from 'src/modules/avisos/constants/avisos-seed-alertas';
import { selectMissingAlertaSeeds } from 'src/modules/avisos/utils/select-missing-alerta-seeds.util';

describe('selectMissingAlertaSeeds', () => {
  it('cria tudo na primeira vez e nada na segunda', () => {
    expect(selectMissingAlertaSeeds(AVISOS_SEED_ALERTAS, [])).toHaveLength(3);
    expect(selectMissingAlertaSeeds(AVISOS_SEED_ALERTAS, AVISOS_SEED_ALERTAS.map((s) => s.nome))).toEqual([]);
  });

  it('compara nomes sem acento e caixa', () => {
    expect(selectMissingAlertaSeeds(AVISOS_SEED_ALERTAS, ['LANCAMENTOS FINANCEIROS ATRASADOS'])).toHaveLength(2);
  });
});
