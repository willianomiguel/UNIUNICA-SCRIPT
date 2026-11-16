import { type CodeExecutionData } from 'integracore-shared/ai';

export type CodeExecutionStreamEmitter = (data: CodeExecutionData) => void;
