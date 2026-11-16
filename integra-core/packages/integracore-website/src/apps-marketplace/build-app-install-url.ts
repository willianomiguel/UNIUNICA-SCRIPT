const DEFAULT_INTEGRA_APP_BASE_URL = 'https://app.integracore.com';

export const buildAppInstallUrl = (universalIdentifier: string): string => {
  const baseUrl =
    process.env.INTEGRA_APP_BASE_URL ?? DEFAULT_INTEGRA_APP_BASE_URL;

  const returnToPath = `/settings/applications/available/${universalIdentifier}`;

  return `${baseUrl.replace(/\/$/, '')}/?returnToPath=${encodeURIComponent(returnToPath)}`;
};
