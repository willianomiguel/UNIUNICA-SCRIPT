export function getCrowdinTokenOrThrow(): string {
  const token = process.env.CROWDIN_PERSONAL_TOKEN;

  if (!token) {
    throw new Error(
      'CROWDIN_PERSONAL_TOKEN environment variable not set. Get your token from: https://integracore.crowdin.com/u/settings#api-key',
    );
  }

  return token;
}
