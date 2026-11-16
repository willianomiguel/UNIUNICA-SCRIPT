// Sections and data files never inline external URLs.
export const SITE_URLS: Record<
  | 'appWelcome'
  | 'calBooking'
  | 'discord'
  | 'docsApi'
  | 'docsDevelopers'
  | 'docsGettingStarted'
  | 'docsMcp'
  | 'docsSelfHost'
  | 'docsSelfHostLicense'
  | 'docsUserGuide'
  | 'github'
  | 'githubIssues'
  | 'linkedin'
  | 'trustCenter'
  | 'x',
  string
> = {
  appWelcome: 'https://app.integracore.com/welcome',
  calBooking: 'https://cal.com/forms/f7841033-0a20-4958-8c92-4e34ec128a81',
  discord: 'https://discord.gg/cx5n4Jzs57',
  docsApi: 'https://docs.integracore.com/developers/extend/api',
  docsDevelopers: 'https://docs.integracore.com/developers/introduction',
  docsGettingStarted: 'https://docs.integracore.com/getting-started/introduction',
  docsMcp: 'https://docs.integracore.com/user-guide/ai/capabilities/mcp',
  docsSelfHost:
    'https://docs.integracore.com/developers/self-host/capabilities/docker-compose',
  docsSelfHostLicense:
    'https://docs.integracore.com/user-guide/billing/capabilities/pricing-plans#get-an-organization-key',
  docsUserGuide: 'https://docs.integracore.com/user-guide/introduction',
  github: 'https://github.com/integracorehq/integracore',
  githubIssues: 'https://github.com/integracorehq/integracore/issues',
  linkedin: 'https://www.linkedin.com/company/integracore',
  trustCenter: 'https://trust.integracore.com',
  x: 'https://x.com/integracorecrm',
};
