import { BaseWorkspaceEntity } from 'src/engine/integracore-orm/base.workspace-entity';

export class ShortLinkWorkspaceEntity extends BaseWorkspaceEntity {
  authoredTemplateUrl: string;
  resolvedDestinationUrl: string;
  templateAndResolvedUrlHash: string;
}
