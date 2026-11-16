import { type RecordGqlOperationSignature } from 'integracore-shared/types';

export type RecordGqlOperationSignatureFactory<FactoryParams extends object> = (
  factoryParams: FactoryParams,
) => RecordGqlOperationSignature;
