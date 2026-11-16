import {
  getLogoUrlFromDomainName,
  isValidDomain,
  normalizeDomain,
} from 'integracore-shared/utils';

import { PRIVATE_DOMAIN_SUFFIXES } from '@/settings/security/constants/PrivateDomainSuffixes';

export const getOriginFaviconUrl = ({
  origin,
  allowRequestsToIntegraCoreIcons,
}: {
  origin: string;
  allowRequestsToIntegraCoreIcons: boolean;
}) => {
  const domain = normalizeDomain(origin);

  const isPrivateDomain = PRIVATE_DOMAIN_SUFFIXES.some((suffix) =>
    domain.endsWith(`.${suffix}`),
  );

  if (
    !allowRequestsToIntegraCoreIcons ||
    isPrivateDomain ||
    !isValidDomain(domain)
  ) {
    return undefined;
  }

  return getLogoUrlFromDomainName(domain);
};
