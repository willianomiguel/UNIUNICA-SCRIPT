import { type AlertaCanal } from 'src/modules/avisos/types/alerta-canal';
import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';

const METRICAS: AlertaMetrica[] = [
  'TAXA_CHARGEBACK',
  'TAXA_RECUSA',
  'FATURAMENTO_DIA',
  'VENDAS_DIA',
  'GASTO_TRAFEGO_DIA',
  'LANCAMENTOS_ATRASADOS',
  'METAS_EM_RISCO',
  'SPRINT_ATRASADA',
];
const CANAIS: AlertaCanal[] = ['SLACK', 'DISCORD', 'WHATSAPP', 'WEBHOOK'];

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toText = (value: unknown): string => (typeof value === 'string' ? value : '');

export const parseAlertaRule = (record: Record<string, unknown>): AlertaRule | null => {
  if (typeof record.id !== 'string') {
    return null;
  }

  return {
    id: record.id,
    nome: toText(record.nome).trim() || 'Alerta sem nome',
    ativo: record.ativo === true,
    metrica: METRICAS.find((metrica) => metrica === record.metrica) ?? null,
    operador: record.operador === 'MENOR_QUE' ? 'MENOR_QUE' : 'MAIOR_QUE',
    limite: toNumberOrNull(record.limite),
    janelaDias: Math.max(1, toNumberOrNull(record.janelaDias) ?? 1),
    canal: CANAIS.find((canal) => canal === record.canal) ?? null,
    destino: toText(record.destino).trim(),
    mensagem: toText(record.mensagem),
    cooldownHoras: Math.max(0, toNumberOrNull(record.cooldownHoras) ?? 0),
    ultimoDisparo: typeof record.ultimoDisparo === 'string' ? record.ultimoDisparo : null,
  };
};
