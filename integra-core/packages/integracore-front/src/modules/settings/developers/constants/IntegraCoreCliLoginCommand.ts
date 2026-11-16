import { doNotTranslate } from 'integracore-shared/i18n';

import { REACT_APP_SERVER_BASE_URL } from '~/config';

export const INTEGRA_CLI_LOGIN_COMMAND = doNotTranslate(
  `npx integracore@latest auth login --url ${REACT_APP_SERVER_BASE_URL} --use`,
);
