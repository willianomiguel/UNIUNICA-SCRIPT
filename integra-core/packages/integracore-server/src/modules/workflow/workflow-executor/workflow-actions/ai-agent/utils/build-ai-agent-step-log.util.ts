import { type AgentRunSummary } from 'integracore-shared/ai';
import { isDefined } from 'integracore-shared/utils';
import { type WorkflowRunStepLog } from 'integracore-shared/workflow';

export const buildAiAgentStepLog = ({
  summary,
  threadId,
}: {
  summary: AgentRunSummary;
  threadId: string | null;
}): WorkflowRunStepLog => ({
  details: {
    type: 'AI_AGENT',
    ...summary,
    ...(isDefined(threadId) ? { threadId } : {}),
  },
  entries: [],
  sizeBytes: 0,
});
