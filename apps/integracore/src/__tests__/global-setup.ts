import { runIntegra } from './run-integra';

function validateEnvironmentOrThrow(): { apiUrl: string; apiKey: string } {
  const apiUrl = process.env.INTEGRA_API_URL;
  const apiKey = process.env.INTEGRA_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error(
      'INTEGRA_API_URL and INTEGRA_API_KEY must be set.\n' +
        'Or set them in vitest env config.',
    );
  }

  return { apiUrl, apiKey };
}

async function checkServerOrThrow(apiUrl: string) {
  const response = await fetch(`${apiUrl}/healthz`).catch(() => {
    throw new Error(
      `Servidor IntegraCore não responde em ${apiUrl}. ` +
        'Suba o servidor antes de rodar os testes de integração.',
    );
  });

  if (!response.ok) {
    throw new Error(`Server at ${apiUrl} returned ${response.status}`);
  }
}

export async function setup() {
  const { apiUrl } = validateEnvironmentOrThrow();

  await checkServerOrThrow(apiUrl);
  await teardown();

  const result = await runIntegra(['app', 'apply', '--create']);

  if (!result.ok) {
    throw new Error(
      `App apply failed: ${result.error.code} ${result.error.message}`,
    );
  }
}

export async function teardown() {
  const result = await runIntegra(['app', 'uninstall', '--yes']);

  if (!result.ok && result.error.code !== 'APP_NOT_INSTALLED') {
    throw new Error(
      `App uninstall failed: ${result.error.code} ${result.error.message}`,
    );
  }
}
