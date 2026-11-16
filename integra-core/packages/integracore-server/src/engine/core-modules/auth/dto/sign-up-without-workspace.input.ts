import { ArgsType, Field } from '@nestjs/graphql';

import { IsOptional, IsString, Matches } from 'class-validator';
import { PARTNER_PATTERN } from 'integracore-shared/constants';

import { UserCredentialsInput } from 'src/engine/core-modules/auth/dto/user-credentials.input';

@ArgsType()
export class SignUpWithoutWorkspaceInput extends UserCredentialsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Matches(PARTNER_PATTERN)
  affiliatePartnerName?: string;
}
