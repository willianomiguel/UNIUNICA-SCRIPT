import { type ExecutionContext, Injectable } from '@nestjs/common';

import { CaptchaGuard } from 'src/engine/core-modules/captcha/captcha.guard';
import { CaptchaService } from 'src/engine/core-modules/captcha/captcha.service';
import { MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Injectable()
export class WorkspaceCreationCaptchaGuard extends CaptchaGuard {
  constructor(
    captchaService: CaptchaService,
    metricsService: MetricsService,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {
    super(captchaService, metricsService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      !this.integracoreConfigService.get('IS_WORKSPACE_CREATION_CAPTCHA_ENABLED')
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
