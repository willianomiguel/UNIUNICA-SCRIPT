import { PassportStrategy } from '@nestjs/passport';

import { Strategy, type VerifyCallback } from 'passport-google-oauth20';

import { getGoogleApisOauthScopes } from 'src/engine/core-modules/auth/utils/get-google-apis-oauth-scopes';
import { type IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export type GoogleApiScopeConfig = {
  isCalendarEnabled?: boolean;
  isMessagingAliasFetchingEnabled?: boolean;
};

export abstract class GoogleAPIsOauthCommonStrategy extends PassportStrategy(
  Strategy,
  'google-apis',
) {
  constructor(integracoreConfigService: IntegraCoreConfigService) {
    const scopes = getGoogleApisOauthScopes();

    super({
      clientID: integracoreConfigService.get('AUTH_GOOGLE_CLIENT_ID'),
      clientSecret: integracoreConfigService.get('AUTH_GOOGLE_CLIENT_SECRET'),
      callbackURL: integracoreConfigService.get('AUTH_GOOGLE_APIS_CALLBACK_URL'),
      scope: scopes,
      passReqToCallback: true,
    });
  }

  abstract validate(
    request: Express.Request,
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): Promise<void>;
}
