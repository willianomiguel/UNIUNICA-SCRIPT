import { isNonEmptyString } from '@sniptt/guards';

const INTEGRA_APPLICATION_PACKAGE_SCOPE = '@integracorehq/';

export const isIntegraCoreApplicationPackage = (
  sourcePackage: string | null | undefined,
): boolean =>
  isNonEmptyString(sourcePackage) &&
  sourcePackage.startsWith(INTEGRA_APPLICATION_PACKAGE_SCOPE);
