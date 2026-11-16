import { type z } from 'zod';
import { type workflowAiAgentActionSettingsSchema } from 'integracore-shared/workflow';

export type WorkflowAiAgentActionInput = z.infer<
  typeof workflowAiAgentActionSettingsSchema
>['input'];
