import { type AgentResponseFieldType } from 'integracore-shared/ai';

export type OutputSchemaField = {
  id: string;
  name: string;
  description?: string;
  type: AgentResponseFieldType | undefined;
};
