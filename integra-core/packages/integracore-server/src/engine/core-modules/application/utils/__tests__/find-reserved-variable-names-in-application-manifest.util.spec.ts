import { findReservedVariableNamesInApplicationManifest } from 'src/engine/core-modules/application/utils/find-reserved-variable-names-in-application-manifest.util';

describe('findReservedVariableNamesInApplicationManifest', () => {
  it('should return no names when the manifest declares no variables', () => {
    expect(findReservedVariableNamesInApplicationManifest({})).toEqual([]);
  });

  it('should ignore names that are not reserved', () => {
    expect(
      findReservedVariableNamesInApplicationManifest({
        serverVariables: { APP_API_KEY: { isSecret: true } },
        applicationVariables: {
          integracore_api_url: {
            universalIdentifier: 'application-variable-id',
            isSecret: false,
          },
        },
      }),
    ).toEqual([]);
  });

  it('should return reserved names from server and application variables', () => {
    expect(
      findReservedVariableNamesInApplicationManifest({
        serverVariables: {
          APP_API_KEY: { isSecret: true },
          INTEGRA_API_URL: { isSecret: false },
        },
        applicationVariables: {
          APPLICATION_ID: {
            universalIdentifier: 'application-variable-id',
            isSecret: false,
          },
        },
      }),
    ).toEqual(['INTEGRA_API_URL', 'APPLICATION_ID']);
  });

  it('should return a name declared in both kinds of variable once', () => {
    expect(
      findReservedVariableNamesInApplicationManifest({
        serverVariables: { INTEGRA_API_KEY: { isSecret: true } },
        applicationVariables: {
          INTEGRA_API_KEY: {
            universalIdentifier: 'application-variable-id',
            isSecret: true,
          },
        },
      }),
    ).toEqual(['INTEGRA_API_KEY']);
  });

  it('should return names starting with INTEGRA_ that IntegraCore does not inject yet', () => {
    expect(
      findReservedVariableNamesInApplicationManifest({
        serverVariables: { INTEGRA_SERVER_SETTING: { isSecret: true } },
        applicationVariables: {
          INTEGRA_WORKSPACE_SETTING: {
            universalIdentifier: 'application-variable-id',
            isSecret: false,
          },
        },
      }),
    ).toEqual(['INTEGRA_SERVER_SETTING', 'INTEGRA_WORKSPACE_SETTING']);
  });
});
