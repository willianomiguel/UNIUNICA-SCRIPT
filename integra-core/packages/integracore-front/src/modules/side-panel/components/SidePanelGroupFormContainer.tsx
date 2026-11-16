import { styled } from '@linaria/react';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledFormContainer = styled.div`
  padding-inline: ${themeCssVariables.spacing[1]};
`;

export const SidePanelGroupFormContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StyledFormContainer>{children}</StyledFormContainer>;
};
