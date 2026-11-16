import { Injectable } from '@nestjs/common';

import {
  type AdminPanelUsageLimitDefaultDTO,
  type AdminPanelWorkspaceUsageLimitsDTO,
} from 'src/engine/core-modules/admin-panel/dtos/admin-panel-workspace-usage-limits.dto';
import { type OptionalNumericConfigVariableKey } from 'src/engine/core-modules/integracore-config/types/optional-numeric-config-variable-key.type';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { UsageLimitService } from 'src/engine/core-modules/usage-limit/services/usage-limit.service';
import { type UsageLimitEntity } from 'src/engine/core-modules/usage-limit/usage-limit.entity';
import { buildUsageLimitDefaultScopes } from 'src/engine/core-modules/usage-limit/utils/build-usage-limit-default-scopes.util';
import { buildUsageLimitScope } from 'src/engine/core-modules/usage-limit/utils/build-usage-limit-scope.util';
import { doesUsageLimitRowSuppressDefault } from 'src/engine/core-modules/usage-limit/utils/does-usage-limit-row-suppress-default.util';
import { fromUsageLimitEntityToDto } from 'src/engine/core-modules/usage-limit/utils/from-usage-limit-entity-to-dto.util';

@Injectable()
export class AdminPanelUsageLimitService {
  constructor(
    private readonly usageLimitService: UsageLimitService,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {}

  async findWorkspaceUsageLimits(
    workspaceId: string,
  ): Promise<AdminPanelWorkspaceUsageLimitsDTO> {
    const usageLimits = await this.usageLimitService.findAll(workspaceId);

    return {
      defaults: this.buildDefaults(usageLimits),
      limits: usageLimits.map(fromUsageLimitEntityToDto),
    };
  }

  private buildDefaults(
    usageLimits: UsageLimitEntity[],
  ): AdminPanelUsageLimitDefaultDTO[] {
    const getConfigValue = <TKey extends OptionalNumericConfigVariableKey>(
      key: TKey,
    ) => this.integracoreConfigService.get(key);

    return buildUsageLimitDefaultScopes({ getConfigValue }).map(
      (usageLimitDefault) => {
        const overridingUsageLimit = usageLimits.find((usageLimit) =>
          doesUsageLimitRowSuppressDefault({
            scope: buildUsageLimitScope(usageLimit),
            usageLimitDefault: {
              ...usageLimitDefault,
              operationTypes: [usageLimitDefault.operationType],
            },
          }),
        );

        return {
          resourceType: usageLimitDefault.resourceType,
          operationType: usageLimitDefault.operationType,
          spenderType: usageLimitDefault.spenderType,
          limitKind: usageLimitDefault.limitKind,
          periodCount: usageLimitDefault.periodCount,
          periodUnit: usageLimitDefault.periodUnit,
          unit: usageLimitDefault.unit,
          limitValue: usageLimitDefault.limitValue,
          isOverridable: usageLimitDefault.isOverridable,
          overriddenByUsageLimitId: overridingUsageLimit?.id ?? null,
        };
      },
    );
  }
}
