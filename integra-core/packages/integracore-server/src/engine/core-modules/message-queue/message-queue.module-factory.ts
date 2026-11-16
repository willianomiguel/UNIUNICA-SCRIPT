import { type EventEmitter2 } from '@nestjs/event-emitter';

import {
  type BullMQDriverFactoryOptions,
  MessageQueueDriverType,
  type MessageQueueModuleOptions,
} from 'src/engine/core-modules/message-queue/interfaces';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { type RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { type IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export const messageQueueModuleFactory = async (
  integracoreConfigService: IntegraCoreConfigService,
  redisClientService: RedisClientService,
  metricsService: MetricsService,
  eventEmitter: EventEmitter2,
): Promise<MessageQueueModuleOptions> => {
  const driverType = MessageQueueDriverType.BullMQ;

  switch (driverType) {
    case MessageQueueDriverType.BullMQ: {
      return {
        type: MessageQueueDriverType.BullMQ,
        options: {
          connection: redisClientService.getQueueClient(),
          prefix: redisClientService.getQueuePrefix(),
        },
        metricsService,
        integracoreConfigService,
        eventEmitter,
      } satisfies BullMQDriverFactoryOptions;
    }
    default:
      throw new Error(
        `Invalid message queue driver type (${driverType}), check your .env file`,
      );
  }
};
