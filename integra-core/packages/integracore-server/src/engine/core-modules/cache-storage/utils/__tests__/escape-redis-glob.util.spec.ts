import { escapeRedisGlob } from 'src/engine/core-modules/cache-storage/utils/escape-redis-glob.util';

describe('escapeRedisGlob', () => {
  it.each([
    ['', ''],
    ['{integracore-cache}:engine:workspace:', '{integracore-cache}:engine:workspace:'],
    ['{integracore[prod]}', '{integracore\\[prod\\]}'],
    ['{integracore*}', '{integracore\\*}'],
    ['{integracore?}', '{integracore\\?}'],
    ['{integracore\\prod}', '{integracore\\\\prod}'],
    ['{integracore]prod}', '{integracore\\]prod}'],
  ])('escapes %s as literal Redis glob text', (value, expected) => {
    expect(escapeRedisGlob(value)).toBe(expected);
  });
});
