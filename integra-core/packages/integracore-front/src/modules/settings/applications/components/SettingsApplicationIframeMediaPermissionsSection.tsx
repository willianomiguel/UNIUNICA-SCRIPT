import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { buildApplicationIframeMediaPermissionSummary } from '@/marketplace/utils/buildApplicationIframeMediaPermissionSummary';
import { getPendingApplicationIframeMediaPermissions } from '@/settings/applications/utils/getPendingApplicationIframeMediaPermissions';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useState } from 'react';
import { type IframeMediaPermission } from 'integracore-shared/types';
import { isDefined, isNonEmptyArray } from 'integracore-shared/utils';
import { useToast } from 'integracore-ui/components/feedback';
import { Section } from 'integracore-ui/components/layout';
import { Button } from 'integracore-ui/primitives/input';
import { Text } from 'integracore-ui/primitives/typography';
import { themeCssVariables } from 'integracore-ui/theme';
import {
  ApproveApplicationIframeMediaPermissionsDocument,
  FindOneApplicationDocument,
} from '~/generated-metadata/graphql';
import { useLingui } from '@lingui/react/macro';

type SettingsApplicationIframeMediaPermissionsSectionProps = {
  applicationId: string;
  applicationName: string;
  requestedPermissions: readonly IframeMediaPermission[];
  grantedPermissions: readonly IframeMediaPermission[];
};

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const SettingsApplicationIframeMediaPermissionsSection = ({
  applicationId,
  applicationName,
  requestedPermissions,
  grantedPermissions,
}: SettingsApplicationIframeMediaPermissionsSectionProps) => {
  const { t } = useLingui();
  const { enqueueToast } = useToast();
  const apolloClient = useApolloClient();
  const [hasSavedChanges, setHasSavedChanges] = useState(false);
  const [approvePermissions, { loading: isSaving }] = useMutation(
    ApproveApplicationIframeMediaPermissionsDocument,
  );
  const pendingPermissions = getPendingApplicationIframeMediaPermissions({
    requestedPermissions,
    grantedPermissions,
  });

  const refreshApplication = async () => {
    try {
      await apolloClient.query({
        query: FindOneApplicationDocument,
        variables: { id: applicationId },
        fetchPolicy: 'network-only',
      });
    } catch (error) {
      enqueueToast(getToastOptionsFromError({ error }));
    }
  };

  const reviewPermissions = async () => {
    const approvedPermissions = pendingPermissions;

    if (isSaving || !isNonEmptyArray(approvedPermissions)) {
      return;
    }

    const permissionSummary =
      buildApplicationIframeMediaPermissionSummary(approvedPermissions);
    const confirmationMessage = [
      t`Approve media access for ${applicationName}?`,
      t`This grants access to this app for everyone in your workspace.`,
      ...permissionSummary.map(({ label }) => label),
    ].join('\n');

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      const { data } = await approvePermissions({
        variables: {
          applicationId,
          approvedIframeMediaPermissions: approvedPermissions,
        },
      });

      if (isDefined(data?.approveApplicationIframeMediaPermissions)) {
        setHasSavedChanges(true);
      }
    } catch (error) {
      enqueueToast(getToastOptionsFromError({ error }));
      await refreshApplication();
    }
  };

  if (!isNonEmptyArray(pendingPermissions) && !hasSavedChanges) {
    return null;
  }

  return (
    <Section.Root>
      <Section.Header
        title={t`Embedded website media access`}
        description={t`Review additional microphone or camera access requested by this app. Members still need to enable access and approve the browser permission.`}
      />
      <StyledContent>
        {isNonEmptyArray(pendingPermissions) && (
          <Button
            variant="outline"
            size="sm"
            onClick={reviewPermissions}
            disabled={isSaving}
          >{t`Review media access`}</Button>
        )}
        {hasSavedChanges && (
          <>
            <Text role="status">{t`Changes saved. Reload open IntegraCore tabs to apply the updated permissions. Reloading ends active calls and recordings.`}</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >{t`Reload page`}</Button>
          </>
        )}
      </StyledContent>
    </Section.Root>
  );
};
