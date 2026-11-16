import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { getDocumentationImportDiagnostics } from '../../../../integracore-ui/docs/getDocumentationImportDiagnostics';

const allowedModules = new Set([
  'integracore-ui',
  'integracore-ui/primitives/input',
  'integracore-ui/style.css',
  'react',
]);

const checkImports = (content: string) =>
  getDocumentationImportDiagnostics({
    source: ts.createSourceFile(
      'example.tsx',
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    ),
    allowedModules,
  });

describe('documentation imports', () => {
  it('allows public entry points, exported CSS, and peer dependencies', () => {
    expect(
      checkImports(`
      import { Input } from 'integracore-ui/primitives/input';
      import 'integracore-ui/style.css';
      export { Text } from 'integracore-ui';
      import { useState } from 'react';
    `),
    ).toEqual([]);
  });

  it.each([
    "import { Internal } from 'integracore-ui/internal';",
    "import 'integracore-ui/private.css';",
    "export { Internal } from 'integracore-ui/internal';",
    "const component = import('integracore-ui/internal');",
    "type Internal = import('integracore-ui/internal').Internal;",
    "const component = require('integracore-ui/internal');",
  ])('rejects an unpublished subpath in %s', (content) => {
    const diagnostics = checkImports(content);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].category).toBe(ts.DiagnosticCategory.Error);
    expect(diagnostics[0].messageText).toContain(
      'is not exported by integracore-ui/package.json',
    );
  });

  it.each([
    "import { Checkbox } from '@ui/primitives/input/Checkbox/Checkbox';",
    "import { Input } from '../../integracore-ui/src/input';",
    "import { vi } from 'vitest';",
  ])('rejects a module outside the public surface in %s', (content) => {
    const diagnostics = checkImports(content);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].messageText).toContain(
      'is not a integracore-ui entry point or peer dependency',
    );
  });
});
