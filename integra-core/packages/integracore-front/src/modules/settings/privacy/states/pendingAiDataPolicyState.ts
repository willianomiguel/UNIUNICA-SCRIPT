import { type AiDataPolicy } from 'integracore-shared/ai';

import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const pendingAiDataPolicyState = createAtomState<AiDataPolicy | null>({
  key: 'pendingAiDataPolicyState',
  defaultValue: null,
});
