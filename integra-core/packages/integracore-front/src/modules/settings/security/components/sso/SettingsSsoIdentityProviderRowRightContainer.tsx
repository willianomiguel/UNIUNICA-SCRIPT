/* @license Enterprise */

import { SettingsSecuritySsoRowDropdownMenu } from '@/settings/security/components/sso/SettingsSecuritySsoRowDropdownMenu';
import { type SsoIdentityProvider } from '@/settings/security/types/SsoIdentityProvider';
import { getColorBySsoIdentityProviderStatus } from '@/settings/security/utils/getColorBySsoIdentityProviderStatus';
import { styled } from '@linaria/react';
import { Status } from 'integracore-ui/primitives/data-display';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledRowRightContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

export const SettingsSsoIdentityProviderRowRightContainer = ({
  ssoIdp,
}: {
  ssoIdp: Omit<SsoIdentityProvider, '__typename'>;
}) => {
  return (
    <StyledRowRightContainer>
      <Status
        color={getColorBySsoIdentityProviderStatus[ssoIdp.status]}
        weight="medium"
      >
        {ssoIdp.status}
      </Status>
      <SettingsSecuritySsoRowDropdownMenu ssoIdp={ssoIdp} />
    </StyledRowRightContainer>
  );
};
