import { Response } from 'integra-sdk/logic-function';

export const respostaJson = (status: number, corpo: object): Response =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'content-type': 'application/json' },
  });
