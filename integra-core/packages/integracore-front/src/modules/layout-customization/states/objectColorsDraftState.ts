import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';
import { type ThemeColor } from 'integracore-ui/theme';

export const objectColorsDraftState = createAtomState<
  Record<string, ThemeColor>
>({
  key: 'objectColorsDraftState',
  defaultValue: {},
});
