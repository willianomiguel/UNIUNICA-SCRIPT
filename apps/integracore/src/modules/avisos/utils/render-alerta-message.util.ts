import { ALERTA_MENSAGEM_PADRAO } from 'src/modules/avisos/constants/alerta-mensagem-padrao';
import { ALERTA_METRICA_LABELS } from 'src/modules/avisos/constants/alerta-metrica-labels';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';
import { formatMetricValue } from 'src/modules/avisos/utils/format-metric-value.util';

const OPERADOR_TEXT = { MAIOR_QUE: 'acima de', MENOR_QUE: 'abaixo de' } as const;

// Substitui {nome} {valor} {limite} {metrica} {operador} {janela}; variáveis desconhecidas ficam como estão.
export const renderAlertaMessage = (
  rule: Pick<AlertaRule, 'nome' | 'mensagem' | 'metrica' | 'operador' | 'limite' | 'janelaDias'>,
  valor: number,
): string => {
  const template = rule.mensagem.trim() === '' ? ALERTA_MENSAGEM_PADRAO : rule.mensagem;
  const variables: Record<string, string> = {
    nome: rule.nome,
    valor: formatMetricValue(rule.metrica, valor),
    limite: rule.limite === null ? '—' : formatMetricValue(rule.metrica, rule.limite),
    metrica: rule.metrica === null ? 'métrica' : ALERTA_METRICA_LABELS[rule.metrica],
    operador: OPERADOR_TEXT[rule.operador],
    janela: `${rule.janelaDias} ${rule.janelaDias === 1 ? 'dia' : 'dias'}`,
  };

  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : placeholder,
  );
};
