import { describe, expect, it } from 'vitest';

import { buildSlackPayload } from 'src/modules/avisos/utils/build-slack-payload.util';

describe('buildSlackPayload', () => {
  it('usa o campo text', () => {
    expect(buildSlackPayload('oi')).toEqual({ text: 'oi' });
  });
});
