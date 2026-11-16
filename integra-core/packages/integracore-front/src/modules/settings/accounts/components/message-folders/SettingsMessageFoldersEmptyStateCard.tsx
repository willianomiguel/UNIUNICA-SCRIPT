import { styled } from '@linaria/react';
import { Section } from 'integracore-ui/components/layout';
import { IconFolder } from 'integracore-ui/icon';
import { useTheme, themeCssVariables } from 'integracore-ui/theme';
import { useLingui } from '@lingui/react/macro';

const StyledEmptyState = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

export const SettingsMessageFoldersEmptyStateCard = () => {
  const { t } = useLingui();
  const theme = useTheme();

  return (
    <Section.Root>
      <StyledEmptyState>
        <IconFolder size={theme.icon.size.md} />
        <div>{t`No folders found for this account`}</div>
      </StyledEmptyState>
    </Section.Root>
  );
};
