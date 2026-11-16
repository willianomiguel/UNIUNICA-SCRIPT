import { spawn } from 'child_process';
import { delimiter, join } from 'path';

type IntegraCliError = {
  code: string;
  message: string;
  hint?: string;
};

export type IntegraCliResult =
  | { ok: true; data: unknown }
  | { ok: false; error: IntegraCliError };

function withoutProjectBinaries(pathValue: string) {
  return pathValue
    .split(delimiter)
    .filter(
      (entry) =>
        entry !== process.env.BERRY_BIN_FOLDER &&
        !entry.endsWith(join('node_modules', '.bin')),
    )
    .join(delimiter);
}

export function runIntegra(cliArguments: string[]): Promise<IntegraCliResult> {
  const executable = process.env.INTEGRA_CLI ?? 'yarn';
  // Pela CLI global os argumentos começam no comando; pelo yarn entram depois do script `integra`.
  const peloYarn = /^yarn(\.cmd|\.exe)?$/i.test(executable);
  const comando = peloYarn ? ['integra', ...cliArguments, '--json'] : [...cliArguments, '--json'];

  return new Promise((resolve, reject) => {
    const child = spawn(executable, comando, {
      env: {
        ...process.env,
        PATH: withoutProjectBinaries(process.env.PATH ?? ''),
      },
      stdio: ['ignore', 'pipe', 'inherit'],
      shell: process.platform === 'win32',
    });
    let stdout = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });

    child.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') {
        reject(error);

        return;
      }

      reject(
        new Error(
          `${executable} was not found. Aponte INTEGRA_CLI para a CLI do projeto (yarn integra) ou para um executável compatível.`,
        ),
      );
    });

    child.on('close', (exitCode) => {
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(
          new Error(
            `${executable} ${cliArguments.join(' ')} exited with code ${exitCode} without a JSON result. ` +
              'Confira se o executável é a CLI do projeto (yarn integra --version) ou ajuste INTEGRA_CLI.',
          ),
        );
      }
    });
  });
}
