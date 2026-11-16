import { MobileBreadcrumb } from '@/ui/navigation/bread-crumb/components/MobileBreadcrumb';
import { type BreadcrumbProps } from '@/ui/navigation/bread-crumb/types/BreadcrumbProps';
import { getBreadcrumbItems } from '@/ui/navigation/bread-crumb/utils/getBreadcrumbItems';
import { isNonEmptyArray } from 'integracore-shared/utils';
import { Breadcrumb as BreadcrumbPrimitive } from 'integracore-ui/primitives/navigation';
import { useIsMobile } from 'integracore-ui/utilities';
import { useLingui } from '@lingui/react/macro';

export const Breadcrumb = ({ links }: BreadcrumbProps) => {
  const { t } = useLingui();
  const isMobile = useIsMobile();

  if (isMobile && isNonEmptyArray(links)) {
    return <MobileBreadcrumb links={links} />;
  }

  return (
    <BreadcrumbPrimitive
      aria-label={t`Breadcrumb`}
      links={getBreadcrumbItems(links)}
    />
  );
};
