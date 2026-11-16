import { PageLayoutType } from 'integracore-shared/types';
import { z } from 'zod';

import { FRONT_COMPONENT_WRAPPER_NAME } from 'src/engine/metadata-modules/ai/ai-front-component/constants/front-component-wrapper-name.constant';
import { FrontComponentBuildException } from 'src/engine/metadata-modules/ai/ai-front-component/exceptions/front-component-build.exception';
import { type FrontComponentBuildInput } from 'src/engine/metadata-modules/ai/ai-front-component/types/front-component-build-input.type';

const frontComponentEntryOptionsSchema = z.object({
  pageLayoutType: z.enum([
    PageLayoutType.DASHBOARD,
    PageLayoutType.RECORD_PAGE,
  ]),
});

export const buildFrontComponentEntrySource = ({
  componentId,
  name,
  source,
  pageLayoutType,
}: FrontComponentBuildInput): string => {
  const parsedOptions = frontComponentEntryOptionsSchema.safeParse({
    pageLayoutType,
  });

  if (!parsedOptions.success) {
    throw new FrontComponentBuildException({
      message: parsedOptions.error.message,
      code: 'INVALID_SETTINGS',
    });
  }

  return `import { useSyncExternalStore as useIntegraCoreSyncExternalStore } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import {
  THEME_DARK as INTEGRA_THEME_DARK,
  THEME_LIGHT as INTEGRA_THEME_LIGHT,
  ThemeProvider as IntegraCoreThemeProvider,
} from 'integracore-ui/theme';
import { PageLayoutType as IntegraCorePageLayoutType } from 'integracore-shared/types';
import 'integracore-ui/style.css';
import 'integracore-ui/theme-light.css';
${source}
const INTEGRA_DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
function subscribeToIntegraCoreColorScheme(onColorSchemeChange: () => void) {
  const mediaQueryList = window.matchMedia(INTEGRA_DARK_COLOR_SCHEME_QUERY);
  mediaQueryList.addEventListener('change', onColorSchemeChange);
  return () => mediaQueryList.removeEventListener('change', onColorSchemeChange);
}
function getIntegraCoreColorScheme(): 'light' | 'dark' {
  return window.matchMedia(INTEGRA_DARK_COLOR_SCHEME_QUERY).matches ? 'dark' : 'light';
}
function ${FRONT_COMPONENT_WRAPPER_NAME}() {
  const colorScheme = useIntegraCoreSyncExternalStore(subscribeToIntegraCoreColorScheme, getIntegraCoreColorScheme);
  return (
    <IntegraCoreThemeProvider colorScheme={colorScheme} theme={colorScheme === 'dark' ? INTEGRA_THEME_DARK : INTEGRA_THEME_LIGHT}>
      <Component />
    </IntegraCoreThemeProvider>
  );
}
export default defineFrontComponent({
  universalIdentifier: ${JSON.stringify(componentId)},
  name: ${JSON.stringify(name)},
  component: ${FRONT_COMPONENT_WRAPPER_NAME},
  widgetAvailability: { pageLayoutType: IntegraCorePageLayoutType.${parsedOptions.data.pageLayoutType} },
});
`;
};
