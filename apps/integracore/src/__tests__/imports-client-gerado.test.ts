import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// O build da CLI só deixa fora do bundle `twenty-client-sdk/core` e `/metadata`: o servidor
// entrega o client gerado nesses nomes. Importado pelo nome da marca (`integra-client-sdk/...`),
// o esbuild embute o stub que lança "CoreApiClient was not generated" (bug de 2026-11-16 no painel
// de vendas). `integra-client-sdk/rest` não tem client gerado e pode continuar com o nome da marca.
const IMPORT_PROIBIDO = /from\s+['"]integra-client-sdk\/(core|metadata)['"]/;

const listarArquivos = (pasta: string): string[] =>
  readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) return listarArquivos(caminho);
    return /\.(ts|tsx)$/.test(item.name) ? [caminho] : [];
  });

describe('imports do client gerado', () => {
  it('usa twenty-client-sdk/core e /metadata, nunca o nome da marca', () => {
    const errados = listarArquivos(join(__dirname, '..')).filter((arquivo) =>
      IMPORT_PROIBIDO.test(readFileSync(arquivo, 'utf8')),
    );

    expect(errados).toEqual([]);
  });
});
