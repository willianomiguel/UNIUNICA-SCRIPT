import { styled } from '@linaria/react';
import { TintedIconTile } from 'integracore-ui/components/data-display';
import { LightIconButton } from 'integracore-ui/components/input';
import {
  IconBuildingSkyscraper,
  IconDotsVertical,
  IconLayoutSidebarRight,
  IconPlus,
} from 'integracore-ui/icon';
import { Button } from 'integracore-ui/primitives/input';
import { useTheme } from 'integracore-ui/theme';

import { BackgroundMockTable } from '@/sign-in-background-mock/components/BackgroundMockTable';
import { BackgroundMockViewBar } from '@/sign-in-background-mock/components/BackgroundMockViewBar';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { useLingui } from '@lingui/react/macro';

const StyledTableContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  width: 100%;
`;

export const BackgroundMockPage = () => {
  const { t } = useLingui();
  const theme = useTheme();

  return (
    <PageCardLayout
      header={
        <PageCardHeader
          icon={
            <TintedIconTile
              icon={<IconBuildingSkyscraper size={theme.icon.size.md} />}
              color="blue"
            />
          }
          title={t`Companies`}
          actionButton={
            <>
              <Button
                startIcon={<IconPlus />}
                size="sm"
                variant="solid"
                color="accent"
              >{t`New Company`}</Button>
              <LightIconButton
                emphasis="subtle"
                size="sm"
                aria-label={t`More options`}
              >
                <IconDotsVertical />
              </LightIconButton>
              <Button
                startIcon={<IconLayoutSidebarRight />}
                aria-label={t`Open side panel`}
                size="sm"
                variant="outline"
              />
            </>
          }
        />
      }
      secondaryBar={<BackgroundMockViewBar />}
      showInformationBanner={false}
    >
      <StyledTableContainer>
        <BackgroundMockTable />
      </StyledTableContainer>
    </PageCardLayout>
  );
};
