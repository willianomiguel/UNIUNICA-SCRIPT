import { isNonEmptyString } from '@sniptt/guards';

import { getIntegraCoreUiCascadeLayerName } from '@/host/utils/getIntegraCoreUiCascadeLayerName';

export const getCssImportRuleInIntegraCoreUiCascadeLayer = (
  cssRule: CSSImportRule,
): string => {
  const layerName = getIntegraCoreUiCascadeLayerName(cssRule.layerName);
  const supportsClause = isNonEmptyString(cssRule.supportsText)
    ? ` supports(${cssRule.supportsText})`
    : '';
  const mediaClause = isNonEmptyString(cssRule.media.mediaText)
    ? ` ${cssRule.media.mediaText}`
    : '';

  return `@import url(${CSS.escape(cssRule.href)}) layer(${layerName})${supportsClause}${mediaClause};`;
};
