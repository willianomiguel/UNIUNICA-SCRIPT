import base from './jest.config.mjs';

export default {
  ...base,
  moduleNameMapper: {
    '^integracore-shared/(.*)$': '<rootDir>/../integracore-shared/src/$1',
    '^@/(.*)$': '<rootDir>/../integracore-shared/src/$1',
    ...base.moduleNameMapper,
  },
};
