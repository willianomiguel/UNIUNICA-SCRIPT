/* @license Enterprise */

import { type RecordShareAccessLevel } from 'integracore-shared/types';

export type ShareWithInput = {
  workspaceMemberId?: string;
  roleId?: string;
  everyone?: boolean;
  accessLevel: RecordShareAccessLevel;
};
