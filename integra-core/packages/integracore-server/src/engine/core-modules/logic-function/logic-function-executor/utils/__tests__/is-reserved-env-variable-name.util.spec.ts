import { isReservedEnvVariableName } from 'src/engine/core-modules/logic-function/logic-function-executor/utils/is-reserved-env-variable-name.util';

describe('isReservedEnvVariableName', () => {
  it.each([
    'INTEGRA_API_URL',
    'APPLICATION_ID',
    'INTEGRA_FUTURE_VARIABLE',
    'INTEGRA_',
  ])('should reserve %s', (name) => {
    expect(isReservedEnvVariableName(name)).toBe(true);
  });

  it.each(['APP_API_KEY', 'integracore_api_url', 'MY_INTEGRA_VARIABLE', 'TWENTY'])(
    'should not reserve %s',
    (name) => {
      expect(isReservedEnvVariableName(name)).toBe(false);
    },
  );
});
