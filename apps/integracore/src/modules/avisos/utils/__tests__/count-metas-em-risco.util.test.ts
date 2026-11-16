import { describe, expect, it } from 'vitest';

import { countMetasEmRisco } from 'src/modules/avisos/utils/count-metas-em-risco.util';

describe('countMetasEmRisco', () => {
  it('conta metas EM_RISCO e ATRASADA', () => {
    expect(
      countMetasEmRisco([{ status: 'EM_RISCO' }, { status: 'ATRASADA' }, { status: 'NO_PRAZO' }, { status: 'CONCLUIDA' }]),
    ).toBe(2);
  });
});
