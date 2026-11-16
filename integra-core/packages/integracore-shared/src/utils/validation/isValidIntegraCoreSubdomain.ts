import { SUBDOMAIN_PATTERN } from '@/constants/SubdomainPattern';

export const isValidIntegraCoreSubdomain = (subdomain: string): boolean => {
  return SUBDOMAIN_PATTERN.test(subdomain);
};
