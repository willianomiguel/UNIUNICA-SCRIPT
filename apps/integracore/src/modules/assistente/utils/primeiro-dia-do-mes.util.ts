// "2026-11-15" -> "2026-11-01"
export const primeiroDiaDoMes = (data: string): string => `${data.slice(0, 7)}-01`;
