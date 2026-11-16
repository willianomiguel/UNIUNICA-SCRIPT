import styled from '@emotion/styled';
import { themeCssVariables } from 'integracore-ui/theme';

export const StyledCallRecordingRowLayout = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  gap: ${() => themeCssVariables.spacing[1]};
  height: ${() => themeCssVariables.spacing[10]};
  justify-content: space-between;
  width: 100%;
`;
