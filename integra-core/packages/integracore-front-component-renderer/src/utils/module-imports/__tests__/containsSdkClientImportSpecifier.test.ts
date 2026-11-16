import { containsSdkClientImportSpecifier } from '../containsSdkClientImportSpecifier';

describe('containsSdkClientImportSpecifier', () => {
  it('returns true when the source imports an sdk client module', () => {
    expect(
      containsSdkClientImportSpecifier(
        "import { getClient } from 'integracore-client-sdk/core';",
      ),
    ).toBe(true);
    expect(
      containsSdkClientImportSpecifier(
        "import { getMetadata } from 'integracore-client-sdk/metadata';",
      ),
    ).toBe(true);
  });

  it('returns true for dynamic import and re-export module positions', () => {
    expect(
      containsSdkClientImportSpecifier(
        "const client = await import('integracore-client-sdk/core');",
      ),
    ).toBe(true);
    expect(
      containsSdkClientImportSpecifier(
        "export { getClient } from 'integracore-client-sdk/core';",
      ),
    ).toBe(true);
  });

  it('returns false when the source does not import an sdk client module', () => {
    expect(
      containsSdkClientImportSpecifier("import { useState } from 'react';"),
    ).toBe(false);
  });

  it('returns false for a sibling module sharing the specifier prefix', () => {
    expect(
      containsSdkClientImportSpecifier(
        "import { thing } from 'integracore-client-sdk/core-extra';",
      ),
    ).toBe(false);
    expect(
      containsSdkClientImportSpecifier(
        "import { thing } from 'integracore-client-sdk/metadata-utils';",
      ),
    ).toBe(false);
  });

  it('returns false when the specifier only appears outside an import position', () => {
    expect(
      containsSdkClientImportSpecifier(
        "const docsUrl = 'integracore-client-sdk/core';",
      ),
    ).toBe(false);
    expect(
      containsSdkClientImportSpecifier(
        '// see integracore-client-sdk/core for the generated client',
      ),
    ).toBe(false);
  });
});
