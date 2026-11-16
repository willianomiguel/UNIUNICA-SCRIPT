import { type AgentRunSummary } from 'integracore-shared/ai';

import { type AgentRunCaller } from 'src/engine/metadata-modules/ai/ai-agent-execution/types/agent-run-caller.type';
import { type AgentRunCallerOutcome } from 'src/engine/metadata-modules/ai/ai-agent-execution/types/agent-run-caller-outcome.type';

export type AgentRunOutcomeDelivery = {
  workspaceId: string;
  caller: AgentRunCaller;
  threadId: string | null;
  outcome: AgentRunCallerOutcome;
  summary: AgentRunSummary | null;
  attempt?: number;
};
