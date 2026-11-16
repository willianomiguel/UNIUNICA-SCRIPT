import { isDefined } from 'integracore-shared/utils';

import { setWorkerEnvironmentVariables } from '@/remote/worker/environment/utils/setWorkerEnvironmentVariables';
import { type HostToWorkerRenderContext } from '@/types/HostToWorkerRenderContext';

export const setWorkerEnvironmentVariablesFromRenderContext = (
  renderContext: HostToWorkerRenderContext,
): void => {
  if (isDefined(renderContext.applicationVariables)) {
    setWorkerEnvironmentVariables({
      applicationVariables: JSON.stringify(renderContext.applicationVariables),
    });
  }

  if (isDefined(renderContext.apiUrl)) {
    setWorkerEnvironmentVariables({
      INTEGRA_API_URL: renderContext.apiUrl,
    });
  }

  if (isDefined(renderContext.functionsBaseUrl)) {
    setWorkerEnvironmentVariables({
      INTEGRA_FUNCTIONS_URL: renderContext.functionsBaseUrl,
    });
  }

  if (isDefined(renderContext.applicationAccessToken)) {
    setWorkerEnvironmentVariables({
      INTEGRA_APP_ACCESS_TOKEN: renderContext.applicationAccessToken,
    });
  }
};
