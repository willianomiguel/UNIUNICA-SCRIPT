import { findManyApplications } from 'test/integration/graphql/utils/find-many-applications.util';
import { loginAsIntegraCoreCli } from 'test/integration/metadata/suites/application/utils/login-as-integracore-cli.util';
import { isDefined } from 'integracore-shared/utils';

export const authorizePermissionTestOauthApplicationOrThrow = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  await loginAsIntegraCoreCli(accessToken);

  const { data } = await findManyApplications({
    gqlFields: 'id defaultRoleId',
    expectToFail: false,
    accessToken,
  });

  const oauthOnlyApplication = data.findManyApplications.find(
    ({ defaultRoleId }) => !isDefined(defaultRoleId),
  );

  if (!isDefined(oauthOnlyApplication)) {
    throw new Error('No application without a default role was found');
  }

  return oauthOnlyApplication.id;
};
