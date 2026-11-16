import { styled } from '@linaria/react';
import { themeCssVariables } from 'integracore-ui/theme';
import { useLingui } from '@lingui/react/macro';

type SettingsAdminVersionDisplayProps = {
  version: string | undefined | null;
  loading: boolean;
  noVersionMessage: string;
};

const StyledActionLink = styled.a`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
  text-decoration: none;
`;

const StyledSpan = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
`;

export const SettingsAdminVersionDisplay = ({
  version,
  loading,
  noVersionMessage,
}: SettingsAdminVersionDisplayProps) => {
  const { t } = useLingui();
  if (loading) {
    return <StyledSpan>{t`Loading...`}</StyledSpan>;
  }

  if (!version) {
    return <StyledSpan>{noVersionMessage}</StyledSpan>;
  }

  return (
    <StyledActionLink
      href={`https://hub.docker.com/r/integracorecrm/integracore/tags?name=${version}`}
      target="_blank"
      rel="noreferrer"
    >
      {version}
    </StyledActionLink>
  );
};
