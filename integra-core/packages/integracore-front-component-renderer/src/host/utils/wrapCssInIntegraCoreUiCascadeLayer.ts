import { isNonEmptyString } from '@sniptt/guards';
import { isDefined, isNonEmptyArray } from 'integracore-shared/utils';

import { INTEGRA_UI_CASCADE_LAYER_NAME } from '@/host/constants/IntegraCoreUiCascadeLayerName';
import { getCssImportRuleInIntegraCoreUiCascadeLayer } from '@/host/utils/getCssImportRuleInIntegraCoreUiCascadeLayer';
import { getIntegraCoreUiCascadeLayerName } from '@/host/utils/getIntegraCoreUiCascadeLayerName';

export const wrapCssInIntegraCoreUiCascadeLayer = (cssText: string): string => {
  const parsingDocument = document.implementation.createHTMLDocument('');
  const styleElement = parsingDocument.createElement('style');
  styleElement.textContent = cssText;
  parsingDocument.head.appendChild(styleElement);

  if (!isDefined(styleElement.sheet)) {
    return '';
  }

  const layeredRules: string[] = [];
  const rulesToWrap: string[] = [];

  const flushRulesToWrap = () => {
    if (!isNonEmptyArray(rulesToWrap)) {
      return;
    }

    layeredRules.push(
      `@layer ${INTEGRA_UI_CASCADE_LAYER_NAME} {\n${rulesToWrap.splice(0).join('\n')}\n}`,
    );
  };

  const { cssRules } = styleElement.sheet;

  for (let ruleIndex = 0; ruleIndex < cssRules.length; ruleIndex += 1) {
    const cssRule = cssRules[ruleIndex];

    if (cssRule instanceof CSSImportRule) {
      flushRulesToWrap();
      layeredRules.push(getCssImportRuleInIntegraCoreUiCascadeLayer(cssRule));
      continue;
    }

    if (cssRule instanceof CSSLayerStatementRule) {
      flushRulesToWrap();
      const layerNames = cssRule.nameList.map(getIntegraCoreUiCascadeLayerName);
      layeredRules.push(`@layer ${layerNames.join(', ')};`);
      continue;
    }

    const isIntegraCoreUiLayerBlock =
      cssRule instanceof CSSLayerBlockRule &&
      isNonEmptyString(cssRule.name) &&
      getIntegraCoreUiCascadeLayerName(cssRule.name) === cssRule.name;

    if (cssRule instanceof CSSNamespaceRule || isIntegraCoreUiLayerBlock) {
      flushRulesToWrap();
      layeredRules.push(cssRule.cssText);
      continue;
    }

    rulesToWrap.push(cssRule.cssText);
  }

  flushRulesToWrap();

  return layeredRules.join('\n');
};
