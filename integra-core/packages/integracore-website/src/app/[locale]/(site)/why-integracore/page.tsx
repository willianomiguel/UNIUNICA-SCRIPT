import { getCommunityStats } from '@/platform/community';
import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/platform/i18n/get-route-i18n';
import { resolveLocaleParam } from '@/platform/i18n/resolve-locale-param';
import {
  buildBreadcrumbListJsonLd,
  buildRouteMetadata,
  JsonLd,
} from '@/platform/seo';
import { Menu } from '@/sections/menu';
import { WhyIntegraCoreEditorials } from '@/sections/why-integracore-editorial';
import { WhyIntegraCoreHero } from '@/sections/why-integracore-hero';
import { WhyIntegraCoreMarquee } from '@/sections/why-integracore-marquee';
import { WhyIntegraCoreSignoff } from '@/sections/why-integracore-signoff';

export const generateMetadata = buildRouteMetadata('whyIntegraCore');

export default async function WhyIntegraCorePage({
  params,
}: {
  params: Promise<LocaleRouteParams>;
}) {
  const [, communityStats] = await Promise.all([
    getRouteI18n(params),
    getCommunityStats(),
  ]);
  const locale = resolveLocaleParam((await params).locale);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbListJsonLd(
          [
            { name: 'Home', path: '/' },
            { name: 'Why IntegraCore', path: '/why-integracore' },
          ],
          locale,
        )}
      />
      <Menu communityStats={communityStats} scheme="dark" />
      <main>
        <WhyIntegraCoreHero />
        <WhyIntegraCoreEditorials />
        <WhyIntegraCoreMarquee />
        <WhyIntegraCoreSignoff />
      </main>
    </>
  );
}
