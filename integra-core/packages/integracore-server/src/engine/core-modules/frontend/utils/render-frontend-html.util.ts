import {
  CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID,
  IFRAME_MEDIA_PERMISSIONS_BOOTSTRAP_ELEMENT_ID,
} from 'integracore-shared/constants';
import { type IframeMediaPermission } from 'integracore-shared/types';

import { serializeJsonForHtmlScript } from 'src/engine/core-modules/frontend/utils/serialize-json-for-html-script.util';

export const renderFrontendHtml = ({
  template,
  clientConfig,
  iframeMediaPermissions,
}: {
  template: string;
  clientConfig: object;
  iframeMediaPermissions: IframeMediaPermission[];
}): string =>
  template
    .replace(
      /<!-- BEGIN: IntegraCore Config -->[\s\S]*?<!-- END: IntegraCore Config -->/,
      '<script id="integracore-env-config">window._env_ = {};</script>',
    )
    .replace(
      '</head>',
      () =>
        `<script id="${CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializeJsonForHtmlScript(clientConfig)}</script>` +
        `<script id="${IFRAME_MEDIA_PERMISSIONS_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializeJsonForHtmlScript(iframeMediaPermissions)}</script></head>`,
    );
