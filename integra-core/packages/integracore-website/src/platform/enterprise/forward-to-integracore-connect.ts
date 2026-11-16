import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isDefined } from 'integracore-shared/utils';

type IntegraCoreConnectBinding = {
  fetch: (request: Request) => Promise<Response>;
};

const isIntegraCoreConnectBinding = (
  value: unknown,
): value is IntegraCoreConnectBinding =>
  isDefined(value) &&
  typeof value === 'object' &&
  'fetch' in value &&
  typeof value.fetch === 'function';

export const forwardToIntegraCoreConnect = async (
  request: Request,
): Promise<Response | null> => {
  if (process.env.INTEGRA_CONNECT_FORWARDING_ENABLED !== 'true') {
    return null;
  }

  let binding: unknown;

  try {
    const { env } = await getCloudflareContext({ async: true });

    binding = 'INTEGRA_CONNECT' in env ? env.INTEGRA_CONNECT : undefined;
  } catch (error) {
    console.error(
      '[enterprise] Cloudflare context is unavailable; answering locally',
      error,
    );

    return null;
  }

  if (!isIntegraCoreConnectBinding(binding)) {
    console.error(
      '[enterprise] INTEGRA_CONNECT_FORWARDING_ENABLED is set but the INTEGRA_CONNECT binding is missing; answering locally',
    );

    return null;
  }

  const connectUrl = new URL(request.url);

  connectUrl.pathname = connectUrl.pathname.replace(
    /^\/api\/enterprise\//,
    '/v1/enterprise/',
  );

  return binding.fetch(new Request(connectUrl, request));
};
