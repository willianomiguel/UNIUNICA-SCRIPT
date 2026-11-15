const DISCORD_CONTENT_LIMIT = 2000;

// Discord webhook: content tem limite de 2000 caracteres; sem menções automáticas.
export const buildDiscordPayload = (text: string): Record<string, unknown> => ({
  content: text.length > DISCORD_CONTENT_LIMIT ? `${text.slice(0, DISCORD_CONTENT_LIMIT - 1)}…` : text,
  allowed_mentions: { parse: [] },
});
