import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Injectable()
export class BillingDisabledGuard implements CanActivate {
  constructor(private readonly integracoreConfigService: IntegraCoreConfigService) {}

  canActivate(_context: ExecutionContext): boolean {
    return !this.integracoreConfigService.isBillingEnabled();
  }
}
