import { getUrlSafely, isDefined } from 'integracore-shared/utils';

export const isUrlFromProxiedOrigin = (
  url: string,
  proxiedOrigins: string[],
): boolean => {
  const origin = getUrlSafely(url)?.origin;

  return isDefined(origin) && proxiedOrigins.includes(origin);
};
