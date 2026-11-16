import { Logger } from '@nestjs/common';

import { isDefined } from 'integracore-shared/utils';

import { reportJobMemoryLimitRefusal } from 'src/engine/core-modules/message-queue/drivers/memory/report-job-memory-limit-refusal.util';
import { type MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import {
  MessageQueueException,
  MessageQueueExceptionCode,
} from 'src/engine/core-modules/message-queue/message-queue.exception';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { type IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export type SizedJob = { index: number; groupKey: string; sizeBytes: number };

export class JobSizeLimiter {
  private readonly logger = new Logger(JobSizeLimiter.name);

  constructor(
    private readonly metricsService: MetricsService,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {}

  isEnabled(): boolean {
    return this.integracoreConfigService.get('IS_REDIS_MEMORY_FAIRNESS_ENABLED');
  }

  checkJobSizesOrThrow({
    queueName,
    jobName,
    jobs,
  }: {
    queueName: MessageQueue;
    jobName: string;
    jobs: SizedJob[];
  }): void {
    if (!this.isEnabled()) {
      return;
    }

    const maxBytes = this.integracoreConfigService.get(
      'JOB_QUEUE_MAX_JOB_SIZE_BYTES',
    );
    const oversizedJob = jobs.find(({ sizeBytes }) => sizeBytes > maxBytes);

    if (!isDefined(oversizedJob)) {
      return;
    }

    const { index, groupKey, sizeBytes } = oversizedJob;

    reportJobMemoryLimitRefusal({
      logger: this.logger,
      metricsService: this.metricsService,
      refusal: {
        queueName,
        jobName,
        groupKey,
        reason: 'size',
        requestedBytes: sizeBytes,
        limitBytes: maxBytes,
      },
    });

    throw new MessageQueueException(
      `Job ${index} on queue ${queueName} is ${sizeBytes} bytes, above the ${maxBytes} bytes limit`,
      MessageQueueExceptionCode.JOB_TOO_LARGE,
      { index, sizeBytes, maxBytes },
    );
  }
}
