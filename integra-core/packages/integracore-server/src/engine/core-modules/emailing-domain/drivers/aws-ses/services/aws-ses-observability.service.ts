import { Injectable } from '@nestjs/common';

import {
  AlreadyExistsException,
  CreateConfigurationSetEventDestinationCommand,
} from '@aws-sdk/client-sesv2';

import { isDefined } from 'integracore-shared/utils';

import { AwsSesClientProvider } from 'src/engine/core-modules/emailing-domain/drivers/aws-ses/providers/aws-ses-client.provider';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Injectable()
export class AwsSesObservabilityService {
  constructor(
    private readonly awsSesClientProvider: AwsSesClientProvider,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {}

  async addEventDestination(configurationSetName: string): Promise<void> {
    const tatamiSnsTopicArn = this.integracoreConfigService.get(
      'TATAMI_SNS_TOPIC_ARN',
    );

    if (!isDefined(tatamiSnsTopicArn)) {
      return;
    }

    const sesClient = this.awsSesClientProvider.getSESClient();

    await sesClient
      .send(
        new CreateConfigurationSetEventDestinationCommand({
          ConfigurationSetName: configurationSetName,
          EventDestinationName: 'tatami-sns',
          EventDestination: {
            Enabled: true,
            MatchingEventTypes: [
              'SEND',
              'DELIVERY',
              'BOUNCE',
              'COMPLAINT',
              'REJECT',
              'RENDERING_FAILURE',
              'DELIVERY_DELAY',
            ],
            SnsDestination: { TopicArn: tatamiSnsTopicArn },
          },
        }),
      )
      .catch((error) => {
        if (!(error instanceof AlreadyExistsException)) {
          throw error;
        }
      });
  }
}
