import { type LogLevel } from '@nestjs/common';

export type IntegraCoreLogLevel = LogLevel | 'performance';

export enum LoggerDriverType {
  CONSOLE = 'CONSOLE',
}

export interface ConsoleDriverFactoryOptions {
  type: LoggerDriverType.CONSOLE;
  logLevels?: IntegraCoreLogLevel[];
}

export type LoggerModuleOptions = ConsoleDriverFactoryOptions;
