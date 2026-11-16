import { Injectable } from '@nestjs/common';

import { DEFAULT_DPA_REGION } from 'src/engine/core-modules/dpa/config/dpa-region-config.constant';
import { type DpaRegion } from 'src/engine/core-modules/dpa/types/dpa.type';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

// Region is deployment-wide today; the unused per-workspace arg is kept so it can become a per-workspace override later without touching callers.
@Injectable()
export class DpaRegionService {
  constructor(private readonly integracoreConfigService: IntegraCoreConfigService) {}

  getRegionForWorkspace(_workspace?: Pick<WorkspaceEntity, 'id'>): DpaRegion {
    return this.getDeploymentRegion();
  }

  getDeploymentRegion(): DpaRegion {
    const configured = this.integracoreConfigService.get('DPA_DEPLOYMENT_REGION');

    return configured ?? DEFAULT_DPA_REGION;
  }
}
