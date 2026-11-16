import {
  computeDependencyFileChecksum,
  computePackageJsonChecksum,
} from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

export const computeApplicationPackageChecksums = ({
  packageJsonContent,
  yarnLockContent,
}: {
  packageJsonContent: string;
  yarnLockContent: string | null;
}): { packageJsonChecksum: string; yarnLockChecksum: string | null } => ({
  packageJsonChecksum: computePackageJsonChecksum(packageJsonContent),
  yarnLockChecksum: isDefined(yarnLockContent)
    ? computeDependencyFileChecksum(yarnLockContent)
    : null,
});
