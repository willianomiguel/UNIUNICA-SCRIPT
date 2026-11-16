import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';

import { INTEGRA_UI_CASCADE_LAYER_NAME } from '@/host/constants/IntegraCoreUiCascadeLayerName';

const ANONYMOUS_IMPORT_LAYER_PREFIX = 'anonymous-';

export const getIntegraCoreUiCascadeLayerName = (
  layerName: string | null,
): string => {
  if (!isDefined(layerName)) {
    return INTEGRA_UI_CASCADE_LAYER_NAME;
  }

  if (!isNonEmptyString(layerName)) {
    const anonymousLayerIdentifier = crypto
      .getRandomValues(new Uint32Array(4))
      .join('-');

    return `${INTEGRA_UI_CASCADE_LAYER_NAME}.${ANONYMOUS_IMPORT_LAYER_PREFIX}${anonymousLayerIdentifier}`;
  }

  const isIntegraCoreUiLayer =
    layerName === INTEGRA_UI_CASCADE_LAYER_NAME ||
    layerName.startsWith(`${INTEGRA_UI_CASCADE_LAYER_NAME}.`);

  return isIntegraCoreUiLayer
    ? layerName
    : `${INTEGRA_UI_CASCADE_LAYER_NAME}.${layerName}`;
};
