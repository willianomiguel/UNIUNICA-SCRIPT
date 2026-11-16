import { Injectable } from '@nestjs/common';

import {
  SESv2Client as SESClient,
  type SESv2ClientConfig as SESClientConfig,
} from '@aws-sdk/client-sesv2';

import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { buildAwsRequestHandlerOptions } from 'src/utils/aws-request-handler.util';

@Injectable()
export class AwsSesClientProvider {
  private sesClient: SESClient | null = null;

  constructor(private readonly integracoreConfigService: IntegraCoreConfigService) {}

  public getSESClient(): SESClient {
    if (!this.sesClient) {
      const config: SESClientConfig = {
        region: this.integracoreConfigService.get('AWS_SES_REGION'),
        requestHandler: buildAwsRequestHandlerOptions(),
      };

      const accessKeyId = this.integracoreConfigService.get('AWS_SES_ACCESS_KEY_ID');
      const secretAccessKey = this.integracoreConfigService.get(
        'AWS_SES_SECRET_ACCESS_KEY',
      );
      const sessionToken = this.integracoreConfigService.get(
        'AWS_SES_SESSION_TOKEN',
      );

      if (accessKeyId && secretAccessKey) {
        config.credentials = {
          accessKeyId,
          secretAccessKey,
          ...(sessionToken ? { sessionToken } : {}),
        };
      }

      this.sesClient = new SESClient(config);
    }

    return this.sesClient;
  }
}
