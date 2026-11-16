import { type WorkflowClassifyQuestion } from 'integracore-shared/workflow';

export type WorkflowClassifyActionInput = {
  state: string;
  questions: WorkflowClassifyQuestion[];
};
