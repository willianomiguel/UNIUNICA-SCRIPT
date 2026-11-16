import {
  type ApplicationCapability,
  isApplicationCapability,
} from 'integracore-shared/application';

export const toApplicationCapabilities = (
  capabilities: unknown,
): ApplicationCapability[] => {
  if (!Array.isArray(capabilities)) {
    return [];
  }

  return capabilities.filter(isApplicationCapability);
};
