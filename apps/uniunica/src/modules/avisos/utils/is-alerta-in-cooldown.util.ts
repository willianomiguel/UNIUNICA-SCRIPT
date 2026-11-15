const HOUR_MS = 60 * 60 * 1000;

export const isAlertaInCooldown = (
  ultimoDisparo: string | null,
  cooldownHoras: number,
  now: Date,
): boolean => {
  if (ultimoDisparo === null || !(cooldownHoras > 0)) {
    return false;
  }

  const lastSentAt = new Date(ultimoDisparo).getTime();

  if (Number.isNaN(lastSentAt)) {
    return false;
  }

  return now.getTime() - lastSentAt < cooldownHoras * HOUR_MS;
};
