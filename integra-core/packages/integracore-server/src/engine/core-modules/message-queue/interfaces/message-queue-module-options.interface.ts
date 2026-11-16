import { type EventEmitter2 } from '@nestjs/event-emitter';

import { type BullMQDriverOptions } from 'src/engine/core-modules/message-queue/drivers/bullmq.driver';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { type IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export enum MessageQueueDriverType {
  BullMQ = 'bull-mq',
  Sync = 'sync',
}

export interface BullMQDriverFactoryOptions {
  type: MessageQueueDriverType.BullMQ;
  options: BullMQDriverOptions;
  metricsService: MetricsService;
  integracoreConfigService: IntegraCoreConfigService;
  eventEmitter: EventEmitter2;
}

export interface SyncDriverFactoryOptions {
  type: MessageQueueDriverType.Sync;
  // oxlint-disable-next-line typescript/no-explicit-any
  options: Record<string, any>;
}

export type MessageQueueModuleOptions =
  | BullMQDriverFactoryOptions
  | SyncDriverFactoryOptions;
