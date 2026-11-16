import { type WorkspaceCompanyEnrichment } from 'integracore-shared/workspace';

export const COMPANY_ENRICHMENT_KEY = 'COMPANY_ENRICHMENT';

export type CompanyEnrichmentKeyValueTypeMap = {
  [COMPANY_ENRICHMENT_KEY]: WorkspaceCompanyEnrichment;
};
