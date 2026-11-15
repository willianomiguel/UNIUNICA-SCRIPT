import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';

type Banco = Record<string, RegistroTwenty[]>;

const lerValor = (bruto: string): unknown => {
  if (bruto === 'true') return true;
  if (bruto === 'false') return false;
  if (bruto.startsWith('"')) return JSON.parse(bruto);

  return bruto;
};

// Interpreta o subconjunto da sintaxe de filtro REST usado pelo módulo.
const atendeFiltro = (registro: RegistroTwenty, filtro?: string): boolean => {
  if (!filtro) return true;

  return filtro.split(/,(?=\w+\[)/).every((condicao) => {
    const [, campo, operador, bruto] =
      /^(\w+)\[(\w+)\]:(.*)$/.exec(condicao) ?? [];
    const valor = lerValor(bruto);
    const atual = registro[campo] ?? (typeof valor === 'boolean' ? false : null);

    return operador === 'eq' ? atual === valor : atual !== valor;
  });
};

// Cliente REST em memória para testar utilitários sem servidor.
export const criarClienteRestFalso = (bancoInicial: Banco = {}) => {
  const banco: Banco = structuredClone(bancoInicial);
  let sequencia = 0;
  const chamadas: Array<{ metodo: string; path: string; body?: unknown }> = [];

  const cliente: ClienteRest = {
    get: async <TResponse,>(
      path: string,
      options?: { query?: Record<string, unknown> },
    ) => {
      chamadas.push({ metodo: 'GET', path });
      const [, , plural, id] = path.split('/');
      const registros = banco[plural] ?? [];

      if (id) {
        const registro = registros.find((item) => item.id === id);

        if (!registro) throw new Error('não encontrado');

        return { data: { [plural]: registro } } as TResponse;
      }

      const filtrados = registros.filter((registro) =>
        atendeFiltro(registro, options?.query?.filter as string | undefined),
      );
      const limite = Number(options?.query?.limit ?? 60);
      const inicio = options?.query?.starting_after
        ? Number(options.query.starting_after)
        : 0;
      const pagina = filtrados.slice(inicio, inicio + limite);
      const fim = inicio + pagina.length;

      return {
        data: { [plural]: pagina },
        pageInfo: {
          hasNextPage: fim < filtrados.length,
          endCursor: String(fim),
        },
      } as TResponse;
    },
    post: async <TResponse,>(path: string, body?: unknown) => {
      chamadas.push({ metodo: 'POST', path, body });
      const plural = path.split('/')[2];
      sequencia += 1;
      const registro = {
        ...(body as object),
        id: `novo-${sequencia}`,
      } as RegistroTwenty;

      banco[plural] = [...(banco[plural] ?? []), registro];

      return { data: { criado: registro } } as TResponse;
    },
    patch: async <TResponse,>(path: string, body?: unknown) => {
      chamadas.push({ metodo: 'PATCH', path, body });
      const [, , plural, id] = path.split('/');
      const registro = (banco[plural] ?? []).find((item) => item.id === id);

      if (registro) Object.assign(registro, body);

      return { data: { atualizado: registro } } as TResponse;
    },
  };

  return { cliente, banco, chamadas };
};
