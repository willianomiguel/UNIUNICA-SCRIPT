export type ResultadoLancar =
  | { ok: false; erro: string; categoriasDisponiveis?: string[] }
  | {
      ok: true;
      mensagem: string;
      id: string;
      valor: number;
      tipo: string;
      status: string;
      data: string;
      categoria: string | null;
    };
