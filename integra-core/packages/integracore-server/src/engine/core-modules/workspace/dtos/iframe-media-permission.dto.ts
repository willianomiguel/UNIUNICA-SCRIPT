import { Field, ObjectType } from '@nestjs/graphql';
import { type IframeMediaPermission } from 'integracore-shared/types';

@ObjectType('IframeMediaPermission')
export class IframeMediaPermissionDTO implements IframeMediaPermission {
  @Field()
  origin: string;

  @Field()
  microphone: boolean;

  @Field()
  camera: boolean;
}
