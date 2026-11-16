import { type CreateOneFieldFactoryInput } from 'test/integration/metadata/suites/field-metadata/utils/create-one-field-metadata-query-factory.util';
import { type EachTestingContext } from 'integracore-shared/testing';
import { type FieldMetadataComplexOption } from 'integracore-shared/types';

export type UpdateCreateFieldMetadataSelectTestCase = EachTestingContext<{
  input: Partial<Pick<CreateOneFieldFactoryInput, 'defaultValue'>> &
    Pick<CreateOneFieldFactoryInput, 'options'>;
  expectedOptions?: FieldMetadataComplexOption[];
}>;
