// Lançamentos de exemplo do seed. `mes` é relativo ao mês atual (0 = atual)
// e a chave de idempotência é fixa, então o seed nunca duplica.
export const LANCAMENTOS_EXEMPLO = [
  { chave: 'seed:financeiro:1', descricao: 'Vendas do lançamento (consolidado)', tipo: 'ENTRADA', valor: 18400, mes: -2, dia: 28, status: 'PAGO', categoria: 'Receita de vendas', centroCusto: null, formaPagamento: 'PIX', recorrencia: 'NENHUMA' },
  { chave: 'seed:financeiro:2', descricao: 'Vendas recorrentes (consolidado)', tipo: 'ENTRADA', valor: 22150, mes: -1, dia: 28, status: 'PAGO', categoria: 'Receita de vendas', centroCusto: null, formaPagamento: 'PIX', recorrencia: 'NENHUMA' },
  { chave: 'seed:financeiro:3', descricao: 'Assinaturas de ferramentas (Figma, Notion, Google)', tipo: 'SAIDA', valor: 640, mes: -2, dia: 5, status: 'PAGO', categoria: 'Ferramentas/SaaS', centroCusto: 'DEV', formaPagamento: 'CARTAO', recorrencia: 'MENSAL' },
  { chave: 'seed:financeiro:4', descricao: 'Meta Ads', tipo: 'SAIDA', valor: 4200, mes: -1, dia: 10, status: 'PAGO', categoria: 'Tráfego pago', centroCusto: 'MARKETING', formaPagamento: 'CARTAO', recorrencia: 'NENHUMA' },
  { chave: 'seed:financeiro:5', descricao: 'Meta Ads', tipo: 'SAIDA', valor: 5100, mes: 0, dia: 10, status: 'PENDENTE', categoria: 'Tráfego pago', centroCusto: 'MARKETING', formaPagamento: 'CARTAO', recorrencia: 'NENHUMA' },
  { chave: 'seed:financeiro:6', descricao: 'Folha de pagamento', tipo: 'SAIDA', valor: 9500, mes: -1, dia: 5, status: 'PAGO', categoria: 'Salários', centroCusto: 'ADMINISTRATIVO', formaPagamento: 'TRANSFERENCIA', recorrencia: 'MENSAL' },
  { chave: 'seed:financeiro:7', descricao: 'DAS – Simples Nacional', tipo: 'SAIDA', valor: 1380, mes: 0, dia: 20, status: 'PENDENTE', categoria: 'Impostos', centroCusto: 'ADMINISTRATIVO', formaPagamento: 'BOLETO', recorrencia: 'NENHUMA' },
  { chave: 'seed:financeiro:8', descricao: 'Consultoria de estratégia', tipo: 'SAIDA', valor: 2000, mes: 0, dia: 3, status: 'PAGO', categoria: 'Outros', centroCusto: 'ESTRATEGIA', formaPagamento: 'PIX', recorrencia: 'NENHUMA' },
] as const;
