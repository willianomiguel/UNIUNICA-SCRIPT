import 'reflect-metadata';
import { IntegraCoreAllVersion } from 'src/engine/core-modules/upgrade/constants/integracore-all-versions.constant';

export type RegisteredWorkspaceCommandMetadata = {
  version: IntegraCoreAllVersion;
  timestamp: number;
};

const REGISTERED_WORKSPACE_COMMAND_KEY = 'REGISTERED_WORKSPACE_COMMAND';

export const RegisteredWorkspaceCommand =
  (version: IntegraCoreAllVersion, timestamp: number): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(
      REGISTERED_WORKSPACE_COMMAND_KEY,
      { version, timestamp },
      target,
    );
  };

export const getRegisteredWorkspaceCommandMetadata = (
  target: Function,
): RegisteredWorkspaceCommandMetadata | undefined =>
  Reflect.getMetadata(REGISTERED_WORKSPACE_COMMAND_KEY, target);
