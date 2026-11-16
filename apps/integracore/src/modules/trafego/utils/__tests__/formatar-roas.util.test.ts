import { describe, expect, it } from 'vitest';

import { formatarRoas } from 'src/modules/trafego/utils/formatar-roas.util';

describe('formatarRoas', () => {
  it('formata como multiplicador', () => expect(formatarRoas(3.2)).toBe('3,20×'));
  it('null vira traço', () => expect(formatarRoas(null)).toBe('—'));
});
