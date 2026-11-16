type RegistroVenda = {
  id?: string;
  utmCampaign?: string | null;
  campanhaId?: string | null;
};

type EventoRegistro = {
  recordId?: string;
  properties?: { after?: RegistroVenda };
};

// Dos eventos de banco (lote ou único), pega as vendas com utm_campaign e sem campanha.
export const extrairIdsVendasEvento = (payload: unknown): string[] => {
  if (typeof payload !== 'object' || payload === null) {
    return [];
  }

  const lote = (payload as { events?: unknown }).events;
  const eventos = (Array.isArray(lote) ? lote : [payload]) as EventoRegistro[];
  const ids = new Set<string>();

  for (const evento of eventos) {
    const depois = evento?.properties?.after;
    const id = depois?.id ?? evento?.recordId;

    if (id && depois && depois.utmCampaign && !depois.campanhaId) {
      ids.add(id);
    }
  }

  return [...ids];
};
