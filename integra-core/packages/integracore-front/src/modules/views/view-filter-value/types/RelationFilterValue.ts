import { type jsonRelationFilterValueSchema } from 'integracore-shared/utils';
import { type z } from 'zod';

export type RelationFilterValue = z.infer<typeof jsonRelationFilterValueSchema>;
