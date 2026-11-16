import { type RunAgentResult } from 'integracore-shared/application';

export type SettledAgentRun = Pick<
  RunAgentResult,
  'status' | 'result' | 'error'
>;
