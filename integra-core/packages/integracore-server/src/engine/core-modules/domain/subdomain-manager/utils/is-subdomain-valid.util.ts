import { RESERVED_SUBDOMAINS } from 'integracore-shared/constants';
import { isValidIntegraCoreSubdomain } from 'integracore-shared/utils';

export const isSubdomainValid = (subdomain: string) => {
  return (
    isValidIntegraCoreSubdomain(subdomain) &&
    !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
  );
};
