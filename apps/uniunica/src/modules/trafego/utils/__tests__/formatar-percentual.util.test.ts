import { describe, expect, it } from 'vitest';

import { formatarPercentual } from 'src/modules/trafego/utils/formatar-percentual.util';

describe('formatarPercentual', () => {
  it('formata com duas casas', () => expect(formatarPercentual(2.5)).toBe('2,50%'));
  it('null vira traço', () => expect(formatarPercentual(null)).toBe('—'));
});
