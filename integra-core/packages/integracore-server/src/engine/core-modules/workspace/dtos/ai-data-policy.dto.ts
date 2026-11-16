import { Field, ObjectType } from '@nestjs/graphql';

import { type AiDataPolicy, type DataResidencyRegion } from 'integracore-shared/ai';

@ObjectType('AiDataPolicy')
export class AiDataPolicyDTO implements AiDataPolicy {
  @Field(() => String, { nullable: true })
  requiredDataResidencyRegion: DataResidencyRegion | null;

  @Field(() => Boolean)
  isZeroDataRetentionRequired: boolean;

  @Field(() => Boolean)
  isProductImprovementDataSharingEnabled: boolean;
}
