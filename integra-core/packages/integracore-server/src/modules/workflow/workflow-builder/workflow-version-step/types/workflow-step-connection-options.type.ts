import { type WorkflowActionType } from 'integracore-shared/workflow';

type WorkflowIteratorStepConnectionOptions = {
  connectedStepType: WorkflowActionType.ITERATOR;
  settings: {
    isConnectedToLoop: boolean;
  };
};

type WorkflowIfElseStepConnectionOptions = {
  connectedStepType: WorkflowActionType.IF_ELSE;
  settings: {
    branchId: string;
  };
};

export type WorkflowStepConnectionOptions =
  | WorkflowIteratorStepConnectionOptions
  | WorkflowIfElseStepConnectionOptions;
