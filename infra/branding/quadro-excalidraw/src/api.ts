import { type Parametros } from './parametros';

export type CenaGravada = {
  tipo: 'excalidraw';
  versao: 1;
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type QuadroRemoto = { nome: string; cena: CenaGravada | null; updatedAt: string | null };

export class ErroApi extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
  ) {
    super(mensagem);
  }
}

const registroDaResposta = (corpo: unknown): Record<string, unknown> | null => {
  const data = (corpo as { data?: Record<string, unknown> } | null)?.data;
  const registro = data && typeof data === 'object' ? Object.values(data)[0] : null;

  return registro && typeof registro === 'object' ? (registro as Record<string, unknown>) : null;
};

const cenaValida = (valor: unknown): CenaGravada | null => {
  const cena = valor as Partial<CenaGravada> | null;

  if (!cena || typeof cena !== 'object' || cena.tipo !== 'excalidraw' || !Array.isArray(cena.elements)) {
    return null;
  }

  return {
    tipo: 'excalidraw',
    versao: 1,
    elements: cena.elements,
    appState: cena.appState && typeof cena.appState === 'object' ? cena.appState : {},
    files: cena.files && typeof cena.files === 'object' ? cena.files : {},
  };
};

const chamar = async (parametros: Parametros, metodo: 'GET' | 'PATCH', corpo?: unknown) => {
  const resposta = await fetch(`${parametros.api}/rest/quadros/${parametros.quadroId}?depth=0`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${parametros.token}`,
      ...(corpo === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (!resposta.ok) {
    throw new ErroApi(`HTTP ${resposta.status}`, resposta.status);
  }

  const registro = registroDaResposta(await resposta.json());

  if (registro === null) {
    throw new ErroApi('Resposta sem o quadro', 500);
  }

  return {
    nome: typeof registro.nome === 'string' ? registro.nome : '',
    cena: cenaValida(registro.cena),
    updatedAt: typeof registro.updatedAt === 'string' ? registro.updatedAt : null,
  } satisfies QuadroRemoto;
};

export const lerQuadro = (parametros: Parametros) => chamar(parametros, 'GET');

export const gravarCena = (parametros: Parametros, cena: CenaGravada) => chamar(parametros, 'PATCH', { cena });

// Saída da página: keepalive deixa o PATCH terminar mesmo com o iframe removido, mas só aceita corpo até 64 KB;
// acima disso vai sem keepalive (o navegador pode cortar, e a próxima abertura mostra o último salvo).
const LIMITE_KEEPALIVE = 60 * 1024;

export const gravarCenaAoSair = (parametros: Parametros, cena: CenaGravada) => {
  const corpo = JSON.stringify({ cena });

  void fetch(`${parametros.api}/rest/quadros/${parametros.quadroId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${parametros.token}`, 'Content-Type': 'application/json' },
    body: corpo,
    keepalive: corpo.length < LIMITE_KEEPALIVE,
  }).catch(() => undefined);
};
