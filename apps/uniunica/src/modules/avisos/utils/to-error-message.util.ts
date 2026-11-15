const MAX_LENGTH = 500;

export const toErrorMessage = (error: unknown): string => {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Erro desconhecido';

  return message.length > MAX_LENGTH ? `${message.slice(0, MAX_LENGTH - 1)}…` : message;
};
