import { isDefined } from 'integracore-shared/utils';
import { type WorkspacePersonEnrichment } from 'integracore-shared/workspace';

export const matchWorkspacePersonEnrichmentToUserEmail = ({
  personEnrichment,
  userEmail,
}: {
  personEnrichment: WorkspacePersonEnrichment | null;
  userEmail: string;
}): WorkspacePersonEnrichment | null =>
  isDefined(personEnrichment) &&
  personEnrichment.email.toLowerCase() === userEmail.trim().toLowerCase()
    ? personEnrichment
    : null;
