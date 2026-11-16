import { describe, expect, it } from 'vitest';

import { SEEDS_DOS_MODULOS } from 'src/logic-functions/utils/seeds-dos-modulos.util';

describe('SEEDS_DOS_MODULOS', () => {
  // A instalação não pode criar dados de exemplo; só o financeiro tem dado estrutural (categorias).
  it('roda só o seed estrutural do financeiro', () => {
    expect(SEEDS_DOS_MODULOS.map((seed) => seed.modulo)).toEqual(['financeiro']);
  });
});
