const TIMEOUT_MS = 15_000;

// POST JSON com timeout; lança erro com status e trecho da resposta quando não for 2xx.
export const postJson = async (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = { 'Content-Type': 'application/json' },
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');

      throw new Error(`HTTP ${response.status} ao enviar para ${new URL(url).host}: ${text.slice(0, 200)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Tempo esgotado (${TIMEOUT_MS / 1000}s) ao enviar para ${new URL(url).host}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
