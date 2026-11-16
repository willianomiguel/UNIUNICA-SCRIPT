import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath, isDefined } from 'integracore-shared/utils';

import { type ApplicationContentLocation } from '@/settings/applications/types/ApplicationContentLocation';
import { type ApplicationContentType } from '@/settings/applications/types/ApplicationContentType';

export const getApplicationContentPath = ({
  location,
  contentType,
}: {
  location: ApplicationContentLocation;
  contentType?: ApplicationContentType;
}) => {
  if (location.kind === 'installed') {
    if (isDefined(contentType)) {
      return getSettingsPath(SettingsPath.ApplicationContentTypeDetail, {
        applicationId: location.applicationId,
        contentType,
      });
    }

    return getSettingsPath(SettingsPath.ApplicationContent, {
      applicationId: location.applicationId,
    });
  }

  if (isDefined(contentType)) {
    return getSettingsPath(SettingsPath.AvailableApplicationContentTypeDetail, {
      availableApplicationId: location.availableApplicationId,
      contentType,
    });
  }

  return getSettingsPath(SettingsPath.AvailableApplicationContent, {
    availableApplicationId: location.availableApplicationId,
  });
};
