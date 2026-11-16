import { defineApplication } from 'integracore-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logo: 'public/logo.svg',
  author: 'IntegraCore',
  category: 'Productivity',
  websiteUrl: 'https://www.fathom.ai',
  termsUrl: 'https://www.integracore.com/terms',
  emailSupport: 'contact@integracore.com',
  issueReportUrl: 'https://github.com/integracorehq/integracore/issues',
  galleryImages: [
    'public/gallery/fathom-cover-image-1.png',
    'public/gallery/fathom-cover-image-2.png',
  ],
  serverVariables: {
    FATHOM_CLIENT_ID: {
      description: 'OAuth client ID from the IntegraCore Fathom application.',
      isSecret: false,
      isRequired: true,
    },
    FATHOM_CLIENT_SECRET: {
      description: 'OAuth client secret from the IntegraCore Fathom application.',
      isSecret: true,
      isRequired: true,
    },
  },
});
