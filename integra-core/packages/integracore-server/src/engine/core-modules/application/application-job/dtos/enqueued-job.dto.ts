import { Field, Int, ObjectType } from '@nestjs/graphql';

import { type EnqueuedJob } from 'integracore-shared/application';

@ObjectType('EnqueuedJob')
export class EnqueuedJobDTO implements EnqueuedJob {
  @Field()
  jobId: string;

  @Field(() => Int)
  sizeBytes: number;
}
