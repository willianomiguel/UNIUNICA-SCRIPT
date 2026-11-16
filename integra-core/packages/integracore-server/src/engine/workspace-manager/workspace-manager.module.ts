import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AiAgentModule } from 'src/engine/metadata-modules/ai/ai-agent/ai-agent.module';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleModule } from 'src/engine/metadata-modules/role/role.module';
import { RoleAssignmentModule } from 'src/engine/permissions/role-assignment/role-assignment.module';
import { provideWorkspaceScopedRepository } from 'src/engine/integracore-orm/workspace-scoped-repository/provide-workspace-scoped-repository';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { IntegraCoreStandardApplicationModule } from 'src/engine/workspace-manager/integracore-standard-application/integracore-standard-application.module';

import { WorkspaceManagerService } from './workspace-manager.service';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    AiAgentModule,
    IntegraCoreStandardApplicationModule,
    TypeOrmModule.forFeature([UserWorkspaceEntity, WorkspaceEntity]),
    RoleModule,
    RoleAssignmentModule,
    ApplicationModule,
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  exports: [WorkspaceManagerService],
  providers: [
    WorkspaceManagerService,
    provideWorkspaceScopedRepository(RoleEntity),
  ],
})
export class WorkspaceManagerModule {}
