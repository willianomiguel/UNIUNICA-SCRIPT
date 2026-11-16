// '/rest/metricasTrafego' -> 'metricasTrafego'
export const getRestObjectName = (path: string): string =>
  path.replace(/^\/?rest\//, '').split(/[/?]/)[0];
