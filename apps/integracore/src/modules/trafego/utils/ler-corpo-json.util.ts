// O corpo pode chegar já como objeto ou como texto (ex.: text/plain do sendBeacon).
export const lerCorpoJson = (corpo: unknown): unknown => {
  if (typeof corpo !== 'string') {
    return corpo ?? null;
  }

  try {
    return JSON.parse(corpo);
  } catch {
    return null;
  }
};
