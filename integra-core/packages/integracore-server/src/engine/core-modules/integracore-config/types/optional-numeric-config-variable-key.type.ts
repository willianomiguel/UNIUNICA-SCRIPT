import { type ConfigVariables } from 'src/engine/core-modules/integracore-config/config-variables';

export type OptionalNumericConfigVariableKey = {
  [Key in keyof ConfigVariables]-?: NonNullable<
    ConfigVariables[Key]
  > extends number
    ? Key
    : never;
}[keyof ConfigVariables];
