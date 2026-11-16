export type MetricWindow = {
  // Data de hoje em São Paulo (YYYY-MM-DD).
  today: string;
  // Início do dia de hoje em São Paulo (ISO com offset).
  startOfTodayIso: string;
  // Início da janela de N dias (ISO UTC).
  windowStartIso: string;
};
