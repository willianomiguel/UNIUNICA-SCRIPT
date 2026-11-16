import { defineApplication } from 'integracore-sdk/define';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  FIREFLIES_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
  FIREFLIES_WEBHOOK_SECRET_VARIABLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Fireflies',
  description:
    'Sync Fireflies call transcripts and AI summaries into CallRecording records linked to matching CalendarEvents in IntegraCore, and trigger sync / list / search of Fireflies calls from workflows and the AI chat.',
  logoUrl: 'public/integracore-fireflies.svg',
  author: 'IntegraCore',
  category: 'Productivity',
  galleryImages: [
    'public/gallery/fireflies-cover-image-1.png',
    'public/gallery/fireflies-cover-image-2.png',
  ],
  websiteUrl: 'https://docs.integracore.com/developers/extend/apps/getting-started',
  termsUrl: 'https://www.integracore.com/terms',
  emailSupport: 'contact@integracore.com',
  issueReportUrl: 'https://github.com/integracorehq/integracore/issues',
  applicationVariables: {
    FIREFLIES_API_KEY: {
      universalIdentifier: FIREFLIES_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
      label: 'Fireflies API key',
      description:
        'Your Fireflies API key (Fireflies → Integrations → Fireflies API).',
      isSecret: true,
    },
    FIREFLIES_WEBHOOK_SECRET: {
      universalIdentifier:
        FIREFLIES_WEBHOOK_SECRET_VARIABLE_UNIVERSAL_IDENTIFIER,
      label: 'Fireflies webhook secret',
      description: 'Signing secret from the Fireflies Webhooks V2 setup page.',
      isSecret: true,
    },
  },
});
