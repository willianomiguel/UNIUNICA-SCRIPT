import { INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

type ApplicationLike = {
  universalIdentifier?: string | null;
};

export const isIntegraCoreStandardApplication = (
  application: ApplicationLike | null | undefined,
): boolean =>
  isDefined(application?.universalIdentifier) &&
  application.universalIdentifier ===
    INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER;
