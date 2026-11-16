import { INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { type FlatApplicationCacheMaps } from 'src/engine/core-modules/application/types/flat-application-cache-maps.type';

export const getIntegraCoreStandardApplicationIdOrThrow = (
  flatApplicationMaps: FlatApplicationCacheMaps,
): string => {
  const integracoreStandardApplicationId =
    flatApplicationMaps.idByUniversalIdentifier[
      INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
    ];

  if (!isDefined(integracoreStandardApplicationId)) {
    throw new ApplicationException(
      'Could not find the integracore-standard application in the workspace cache',
      ApplicationExceptionCode.APPLICATION_NOT_FOUND,
    );
  }

  return integracoreStandardApplicationId;
};
