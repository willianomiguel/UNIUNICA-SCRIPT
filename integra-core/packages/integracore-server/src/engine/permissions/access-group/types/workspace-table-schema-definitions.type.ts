import { type WorkspaceSchemaColumnDefinition } from 'src/engine/integracore-orm/workspace-schema-manager/types/workspace-schema-column-definition.type';
import { type WorkspaceSchemaIndexDefinition } from 'src/engine/integracore-orm/workspace-schema-manager/types/workspace-schema-index-definition.type';

export type WorkspaceTableSchemaDefinitions = {
  columnDefinitions: WorkspaceSchemaColumnDefinition[];
  indexDefinitions: WorkspaceSchemaIndexDefinition[];
};
