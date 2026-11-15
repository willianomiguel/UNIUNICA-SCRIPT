// Categorias criadas pelo seed (busca por nome: não duplica).
export const CATEGORIAS_PADRAO = [
  { nome: 'Receita de vendas', tipo: 'ENTRADA', orcamentoMensal: 30000, cor: 'VERDE' },
  { nome: 'Ferramentas/SaaS', tipo: 'SAIDA', orcamentoMensal: 1500, cor: 'AZUL' },
  { nome: 'Tráfego pago', tipo: 'SAIDA', orcamentoMensal: 6000, cor: 'ROSA' },
  { nome: 'Salários', tipo: 'SAIDA', orcamentoMensal: 12000, cor: 'ROXO' },
  { nome: 'Impostos', tipo: 'SAIDA', orcamentoMensal: 3000, cor: 'VERMELHO' },
  { nome: 'Outros', tipo: 'SAIDA', orcamentoMensal: 1000, cor: 'CINZA' },
] as const;
