import { type AlertaSeed } from 'src/modules/avisos/types/alerta-seed';

// Exemplos criados desativados e sem destino: o time preenche o webhook/telefone e ativa.
export const AVISOS_SEED_ALERTAS: AlertaSeed[] = [
  {
    nome: 'Chargeback acima de 1% (30 dias)',
    metrica: 'TAXA_CHARGEBACK',
    operador: 'MAIOR_QUE',
    limite: 1,
    janelaDias: 30,
    canal: 'SLACK',
    cooldownHoras: 24,
    mensagem: '🚨 {nome}: a taxa de chargeback dos últimos {janela} está em {valor} (limite {limite}). Verifique as vendas contestadas.',
  },
  {
    nome: 'Faturamento do dia abaixo de R$ 1.000',
    metrica: 'FATURAMENTO_DIA',
    operador: 'MENOR_QUE',
    limite: 1000,
    janelaDias: 1,
    canal: 'SLACK',
    cooldownHoras: 24,
    mensagem: '📉 {nome}: o faturamento de hoje está em {valor}, abaixo de {limite}.',
  },
  {
    nome: 'Lançamentos financeiros atrasados',
    metrica: 'LANCAMENTOS_ATRASADOS',
    operador: 'MAIOR_QUE',
    limite: 0,
    janelaDias: 1,
    canal: 'SLACK',
    cooldownHoras: 24,
    mensagem: '💸 {nome}: há {valor} lançamento(s) atrasado(s) no financeiro.',
  },
];
