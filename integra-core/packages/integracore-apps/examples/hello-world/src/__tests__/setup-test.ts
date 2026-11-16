import { beforeAll } from 'vitest';

beforeAll(async () => {
  const apiUrl = process.env.INTEGRA_API_URL!;
  const token = process.env.INTEGRA_API_KEY!;

  if (!apiUrl || !token) {
    throw new Error(
      'INTEGRA_API_URL and INTEGRA_API_KEY must be set.\n' +
        'Or set them in vitest env config.',
    );
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/healthz`);
  } catch {
    throw new Error(
      `IntegraCore server is not reachable at ${apiUrl}. ` +
        'Make sure the server is running before executing integration tests.',
    );
  }

  if (!response.ok) {
    throw new Error(`Server at ${apiUrl} returned ${response.status}`);
  }

  process.env.INTEGRA_APP_ACCESS_TOKEN ??= token;
});
