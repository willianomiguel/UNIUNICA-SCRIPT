import { Injectable } from '@nestjs/common';

import { ThrottlerService } from 'src/engine/core-modules/throttler/throttler.service';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

// Logic functions and HTTP requests spend one bucket: an HTTP step can do nothing a logic function cannot.
@Injectable()
export class LogicFunctionExecutionThrottleService {
  constructor(
    private readonly throttlerService: ThrottlerService,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {}

  async consumeToken(workspaceId: string): Promise<boolean> {
    const admittedCount = await this.throttlerService.tokenBucketConsumeUpTo(
      `${workspaceId}-logic-function-execution`,
      1,
      this.integracoreConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT'),
      this.integracoreConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_TTL'),
    );

    return admittedCount === 1;
  }
}
