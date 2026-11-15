import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';

type Notificacao = {
  idPagamento: string | null;
  tipoEvento: string;
};

// Supports Webhooks ({ type, action, data: { id } }, or ?type=payment&data.id=) and legacy IPN (?topic=payment&id=).
export const extrairIdPagamentoMercadoPago = (
  corpo: unknown,
  query: Record<string, string | undefined>,
): Notificacao => {
  const dados = lerObjeto(corpo);
  const tipo = lerTexto(dados.type) ?? lerTexto(dados.topic) ?? lerTexto(query.type) ?? lerTexto(query.topic);
  const tipoEvento = lerTexto(dados.action) ?? tipo ?? 'desconhecido';

  if (tipo !== null && tipo !== 'payment') {
    return { idPagamento: null, tipoEvento };
  }

  const idPagamento =
    lerTexto(lerObjeto(dados, 'data').id) ??
    lerTexto(query['data.id']) ??
    (tipo === 'payment' ? (lerTexto(query.id) ?? lerTexto(dados.resource)?.split('/').pop() ?? null) : null);

  return { idPagamento: idPagamento ?? null, tipoEvento };
};
