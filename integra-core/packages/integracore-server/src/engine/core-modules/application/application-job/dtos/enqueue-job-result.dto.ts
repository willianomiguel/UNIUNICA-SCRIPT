import { Field, ObjectType } from '@nestjs/graphql';

import { type EnqueueJobResult } from 'integracore-shared/application';

@ObjectType('EnqueueJobResult')
export class EnqueueJobResultDTO implements EnqueueJobResult {
  @Field()
  enqueued: boolean;

  @Field()
  logicFunctionUniversalIdentifier: string;

  @Field()
  jobId: string;
}
