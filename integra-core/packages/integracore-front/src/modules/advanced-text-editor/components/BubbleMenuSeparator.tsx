import { styled } from '@linaria/react';
import { Separator } from 'integracore-ui/primitives/layout';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledBubbleMenuSeparatorContainer = styled.div`
  display: flex;
  padding: ${themeCssVariables.spacing[1]} 0;
`;

export const BubbleMenuSeparator = () => (
  <StyledBubbleMenuSeparatorContainer>
    <Separator orientation="vertical" />
  </StyledBubbleMenuSeparatorContainer>
);
