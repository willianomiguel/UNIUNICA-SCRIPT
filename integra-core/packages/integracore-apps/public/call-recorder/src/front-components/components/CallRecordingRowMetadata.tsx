import styled from '@emotion/styled';
import { type IconComponent } from 'integracore-ui/icon';
import { THEME_COMMON, themeCssVariables } from 'integracore-ui/theme';

const StyledMetadata = styled.span`
  align-items: center;
  display: flex;
  gap: ${() => themeCssVariables.spacing['0.5']};
`;

const StyledMetadataIconContainer = styled.span`
  align-items: center;
  color: ${() => themeCssVariables.font.color.light};
  display: flex;
`;

type CallRecordingRowMetadataProps = {
  Icon: IconComponent;
  text: string;
};

export const CallRecordingRowMetadata = ({
  Icon,
  text,
}: CallRecordingRowMetadataProps) => (
  <StyledMetadata>
    <StyledMetadataIconContainer>
      <Icon size={THEME_COMMON.icon.size.md} />
    </StyledMetadataIconContainer>
    {text}
  </StyledMetadata>
);
