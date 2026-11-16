import { type SharedDependenciesBuildContext } from 'integracore-shared/front-component-build';

export type FrontComponentSharedDependencies =
  SharedDependenciesBuildContext & {
    source: string;
    typeReferences: string;
    checksum: string;
  };
