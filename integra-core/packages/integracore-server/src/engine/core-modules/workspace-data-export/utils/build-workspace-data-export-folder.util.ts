import { INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'integracore-shared/application';
import { FileFolder } from 'integracore-shared/types';

export const buildWorkspaceDataExportFolder = ({
  workspaceId,
  exportId,
  folder,
}: {
  workspaceId: string;
  exportId: string;
  folder: 'export' | 'parts';
}) => ({
  workspaceId,
  applicationUniversalIdentifier:
    INTEGRA_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
  fileFolder: FileFolder.WorkspaceDataExport,
  folderPath: folder === 'parts' ? `${exportId}/parts` : exportId,
});
