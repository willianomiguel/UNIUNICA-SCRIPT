import {
  collectFrontComponentTypeReferences,
  FRONT_COMPONENT_REACT_IMPORTS,
} from 'integracore-shared/front-component-build';

let typeReferences: Record<string, string> | undefined;

export const getFrontComponentCompilerTypeReferences = () => {
  typeReferences ??= collectFrontComponentTypeReferences({
    directory: __dirname,
    dependencies: FRONT_COMPONENT_REACT_IMPORTS,
    shouldIncludeLibraries: true,
  });
  return typeReferences;
};
