import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const allowRequestsToIntegraCoreIconsState = createAtomState<boolean>({
  key: 'allowRequestsToIntegraCoreIcons',
  defaultValue: true,
});
