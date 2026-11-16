import { styled } from '@linaria/react';
import { Separator } from 'integracore-ui/primitives/layout';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledSeparatorContainer = styled.div`
  padding-inline: ${themeCssVariables.spacing[4]};
`;

export const SettingsCardSeparator = () => (
  <StyledSeparatorContainer>
    <Separator />
  </StyledSeparatorContainer>
);
