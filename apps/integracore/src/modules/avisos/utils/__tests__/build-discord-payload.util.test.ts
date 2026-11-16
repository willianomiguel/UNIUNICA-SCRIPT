import { describe, expect, it } from 'vitest';

import { buildDiscordPayload } from 'src/modules/avisos/utils/build-discord-payload.util';

describe('buildDiscordPayload', () => {
  it('usa content e bloqueia menções', () => {
    expect(buildDiscordPayload('oi')).toEqual({ content: 'oi', allowed_mentions: { parse: [] } });
  });

  it('corta mensagens acima de 2000 caracteres', () => {
    const content = buildDiscordPayload('a'.repeat(2500)).content as string;

    expect(content).toHaveLength(2000);
    expect(content.endsWith('…')).toBe(true);
  });
});
