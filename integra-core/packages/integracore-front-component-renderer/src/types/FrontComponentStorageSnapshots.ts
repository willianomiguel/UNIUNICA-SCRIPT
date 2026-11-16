import { type FrontComponentStorageType } from 'integracore-sdk/front-component';

export type FrontComponentStorageSnapshots = Record<
  FrontComponentStorageType,
  Record<string, string>
>;
