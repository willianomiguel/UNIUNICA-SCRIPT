import { type DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigVariables } from 'src/engine/core-modules/integracore-config/config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/core-modules/integracore-config/constants/config-variables-instance-tokens.constants';
import { DatabaseConfigModule } from 'src/engine/core-modules/integracore-config/drivers/database-config.module';
import { ConfigGroupHashService } from 'src/engine/core-modules/integracore-config/services/config-group-hash.service';
import { ConfigurableModuleClass } from 'src/engine/core-modules/integracore-config/integracore-config.module-definition';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Global()
@Module({})
export class IntegraCoreConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const isConfigVariablesInDbEnabled =
      process.env.IS_CONFIG_VARIABLES_IN_DB_ENABLED !== 'false';

    const imports = isConfigVariablesInDbEnabled
      ? [DatabaseConfigModule.forRoot()]
      : [];

    return {
      module: IntegraCoreConfigModule,
      imports,
      providers: [
        IntegraCoreConfigService,
        ConfigGroupHashService,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [IntegraCoreConfigService, ConfigGroupHashService],
    };
  }
}
