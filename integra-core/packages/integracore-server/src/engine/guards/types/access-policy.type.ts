import { type PermissionFlagType } from 'integracore-shared/constants';
import { type FeatureFlagKey } from 'integracore-shared/types';

import { type AuthPrincipalGuardConfig } from 'src/engine/guards/types/auth-principal-guard-config.type';

export type AccessPolicy = {
  authPrincipals: AuthPrincipalGuardConfig;
  requiredPermissionFlags: PermissionFlagType[];
  requiredFeatureFlags?: FeatureFlagKey[];
};
