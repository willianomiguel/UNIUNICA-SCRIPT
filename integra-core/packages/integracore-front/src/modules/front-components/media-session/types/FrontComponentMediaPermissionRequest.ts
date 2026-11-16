import { type ApplicationCapability } from 'integracore-shared/application';

export type FrontComponentMediaPermissionRequest = {
  capabilities: ApplicationCapability[];
  abortSignal: AbortSignal;
  resolve: (grantedCapabilities: string[] | null) => void;
};
