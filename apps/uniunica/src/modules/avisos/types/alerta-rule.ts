import { type AlertaCanal } from 'src/modules/avisos/types/alerta-canal';
import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';
import { type AlertaOperador } from 'src/modules/avisos/types/alerta-operador';

export type AlertaRule = {
  id: string;
  nome: string;
  ativo: boolean;
  metrica: AlertaMetrica | null;
  operador: AlertaOperador;
  limite: number | null;
  janelaDias: number;
  canal: AlertaCanal | null;
  destino: string;
  mensagem: string;
  cooldownHoras: number;
  ultimoDisparo: string | null;
};
