// O gerador de client da CLI escreve sempre no pacote de nome original (twenty-client-sdk).
// O app importa pelo nome da marca (integra-client-sdk), então os dois nomes apontam para o
// mesmo pacote físico — sem isso o client gerado não chegaria ao bundle.
// Roda no postinstall.
import fs from 'node:fs';
import path from 'node:path';

const nodeModules = path.resolve(process.cwd(), 'node_modules');
const real = path.join(nodeModules, 'twenty-client-sdk');
const alias = path.join(nodeModules, 'integra-client-sdk');

if (!fs.existsSync(real)) {
  process.exit(0);
}

if (fs.existsSync(alias) || fs.lstatSync(alias, { throwIfNoEntry: false })) {
  fs.rmSync(alias, { recursive: true, force: true });
}

fs.symlinkSync(real, alias, process.platform === 'win32' ? 'junction' : 'dir');
