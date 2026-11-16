// Generated from design-tokens by scripts/generateThemeTokens.ts.
// Do not edit manually. Regenerate with: npx nx generateTokens integracore-ui.
export const themeSpacing = (...multiplicators: number[]): string =>
  multiplicators.map((multiplicator) => `${multiplicator * 4}px`).join(' ');
