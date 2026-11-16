import { parseFrontComponentSharedDependencies } from 'integracore-shared/front-component-build';
import { pathExists, readJson } from '@/app/fs-utils';
import { isDefined } from 'integracore-shared/utils';
import path from 'path';
import {
  FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH,
  type FrontComponentSharedDependenciesManifest,
} from 'integracore-shared/application';

type PackageJsonWithSharedDependencies = {
  frontComponentSharedDependencies?: unknown;
};

export const extractFrontComponentSharedDependencies = async (
  appPath: string,
): Promise<{
  sharedDependencies?: FrontComponentSharedDependenciesManifest;
  errors: string[];
}> => {
  const packageJsonPath = path.join(appPath, 'package.json');

  if (!(await pathExists(packageJsonPath))) {
    return { errors: [] };
  }

  const packageJson =
    await readJson<PackageJsonWithSharedDependencies>(packageJsonPath);
  const { dependencies, errors } = parseFrontComponentSharedDependencies(
    packageJson.frontComponentSharedDependencies,
  );

  if (!isDefined(dependencies)) {
    return { errors };
  }

  return {
    sharedDependencies: {
      dependencies,
      builtPath: FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH,
      builtChecksum: null,
    },
    errors: [],
  };
};
