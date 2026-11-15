// Slack incoming webhook: { text } (mrkdwn).
export const buildSlackPayload = (text: string): Record<string, unknown> => ({ text });
