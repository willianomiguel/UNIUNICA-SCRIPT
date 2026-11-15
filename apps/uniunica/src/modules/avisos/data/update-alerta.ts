import { type RestApiClient } from 'twenty-client-sdk/rest';

export const updateAlerta = async (
  client: RestApiClient,
  id: string,
  data: Record<string, unknown>,
): Promise<void> => {
  await client.patch(`/rest/alertas/${id}`, data);
};
