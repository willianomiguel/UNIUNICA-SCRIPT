import { styled } from '@linaria/react';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  width: 100%;
`;

export const AdvancedFilterDropdownRow = StyledRow;
