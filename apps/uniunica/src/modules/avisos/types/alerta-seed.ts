export type AlertaSeed = {
  nome: string;
  metrica: string;
  operador: string;
  limite: number;
  janelaDias: number;
  canal: string;
  cooldownHoras: number;
  mensagem: string;
};
