import { type AiSdkPackage, type DataResidency } from 'integracore-shared/ai';

// separate so computeCostBreakdown never sees a model without token semantics
export type AiTranscriptionModelConfig = {
  modelId: string;
  sdkPackage: AiSdkPackage;
  label: string;
  description: string;
  dataResidency?: DataResidency;
  zeroDataRetention?: boolean;
  costPerMinute: number;
  isDeprecated?: boolean;
};
