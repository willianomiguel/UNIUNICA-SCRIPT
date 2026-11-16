import { type ToolCategory } from 'integracore-shared/ai';

export type ToolCatalogOptions = {
  categories?: ToolCategory[];
  excludeTools?: Set<string>;
};
