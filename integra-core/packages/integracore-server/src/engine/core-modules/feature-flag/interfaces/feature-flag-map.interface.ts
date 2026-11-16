import { type FeatureFlagKey } from 'integracore-shared/types';

export type FeatureFlagMap = Record<`${FeatureFlagKey}`, boolean>;
