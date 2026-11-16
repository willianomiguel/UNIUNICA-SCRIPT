// Categorias criadas pelo seed (busca por nome: não duplica).
// Só a estrutura: o orçamento mensal começa em zero e cada empresa preenche o seu.
// "Receita de vendas" é usada pela sincronização de vendas aprovadas.
export const CATEGORIAS_PADRAO = [
  { nome: 'Receita de vendas', tipo: 'ENTRADA', cor: 'VERDE' },
  { nome: 'Ferramentas/SaaS', tipo: 'SAIDA', cor: 'AZUL' },
  { nome: 'Tráfego pago', tipo: 'SAIDA', cor: 'ROSA' },
  { nome: 'Salários', tipo: 'SAIDA', cor: 'ROXO' },
  { nome: 'Impostos', tipo: 'SAIDA', cor: 'VERMELHO' },
  { nome: 'Outros', tipo: 'SAIDA', cor: 'CINZA' },
] as const;
