import { RestApiClient } from 'integra-client-sdk/rest';

import { extractRestRecords } from 'src/modules/avisos/utils/extract-rest-records.util';
import { getRestObjectName } from 'src/modules/avisos/utils/get-rest-object-name.util';

type RestPage = { pageInfo?: { hasNextPage?: boolean; endCursor?: string | null } };

const PAGE_SIZE = 200;
const MAX_PAGES = 50;

export const fetchRestRecords = async (
  client: RestApiClient,
  path: string,
  filter?: string,
): Promise<Array<Record<string, unknown>>> => {
  const objectName = getRestObjectName(path);
  const records: Array<Record<string, unknown>> = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const response = await client.get<RestPage>(path, {
      query: { limit: PAGE_SIZE, depth: 0, filter, starting_after: cursor },
    });

    records.push(...extractRestRecords(response, objectName));

    if (response.pageInfo?.hasNextPage !== true || !response.pageInfo.endCursor) {
      break;
    }
    cursor = response.pageInfo.endCursor;
  }

  return records;
};
