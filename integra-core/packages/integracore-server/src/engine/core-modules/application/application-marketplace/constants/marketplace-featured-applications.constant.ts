import { INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS } from 'integracore-shared/application';

export const MARKETPLACE_FEATURED_APPLICATIONS: {
  universalIdentifier: string;
  sourcePackage: string;
  position?: number;
}[] = [
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.CALL_RECORDER,
    sourcePackage: '@integracorehq/call-recorder',
    position: 1,
  },
  {
    universalIdentifier:
      INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.PEOPLE_DATA_LABS,
    sourcePackage: '@integracorehq/people-data-labs',
    position: 2,
  },
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.LAST_CONTACT,
    sourcePackage: '@integracorehq/last-contact',
    position: 3,
  },
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.EXA,
    sourcePackage: '@integracorehq/exa',
    position: 4,
  },
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.SLACK,
    sourcePackage: '@integracorehq/slack',
    position: 5,
  },
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.TEAMS,
    sourcePackage: '@integracorehq/teams',
    position: 6,
  },
  {
    universalIdentifier: INTEGRA_PUBLIC_APP_UNIVERSAL_IDENTIFIERS.FATHOM,
    sourcePackage: '@integracorehq/fathom',
    position: 7,
  },
];
