import { defineApplication } from 'integracore-sdk/define';
import { GRANOLA_API_KEY_ENV_VAR_NAME } from 'src/logic-functions/constants/granola-api-key-env-var-name';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  GRANOLA_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logo: 'public/logo.png',
  author: 'IntegraCore',
  category: 'Productivity',
  websiteUrl: 'https://www.granola.ai',
  termsUrl: 'https://www.integracore.com/terms',
  emailSupport: 'contact@integracore.com',
  issueReportUrl: 'https://github.com/integracorehq/integracore/issues',
  galleryImages: [
    'public/gallery/granola-cover-image-1.png',
    'public/gallery/granola-cover-image-2.png',
  ],
  applicationVariables: {
    [GRANOLA_API_KEY_ENV_VAR_NAME]: {
      universalIdentifier: GRANOLA_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
      label: 'Granola API key',
      description:
        'Workspace or personal API key from Granola Settings → Connectors → API keys.',
      isSecret: true,
    },
  },
});
