import { type MediaSessionMediaType } from 'integracore-front-component-renderer';
import { type IframeMediaPermission } from 'integracore-shared/types';

export const getIframeMediaPermissionMediaTypes = (
  permission: Pick<IframeMediaPermission, 'microphone' | 'camera'>,
): MediaSessionMediaType[] => [
  ...(permission.microphone ? (['audio'] as const) : []),
  ...(permission.camera ? (['video'] as const) : []),
];
