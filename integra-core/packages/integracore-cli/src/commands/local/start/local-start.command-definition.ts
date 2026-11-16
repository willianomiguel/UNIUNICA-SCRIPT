import { type LocalCommandDefinition } from '@/catalog/types/command-definition.type';

export const LOCAL_START_COMMAND_DEFINITION: LocalCommandDefinition = {
  path: ['local', 'start'],
  description: 'Start the local IntegraCore development environment',
  options: [
    {
      flags: '-p, --port <port>',
      description:
        'HTTP port for a new instance (default: 2020, or 2021 with --test)',
    },
    {
      flags: '--test',
      description: 'Use the separate local test instance',
    },
  ],
  arguments: [
    {
      name: 'version',
      description:
        'IntegraCore version or image tag (new instances: engines.integracore, then latest)',
      required: false,
    },
  ],
  examples: ['integracore local start', 'integracore local start 2.53.1 --test'],
  outputModes: ['human', 'json'],
  writes: true,
  needsProject: false,
  needsTarget: false,
  load: async () =>
    (await import('@/commands/local/start/run-local-start-command'))
      .runLocalStartCommand,
};
