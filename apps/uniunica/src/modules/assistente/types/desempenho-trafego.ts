import { type LinhaDesempenhoTrafego } from 'src/modules/assistente/types/linha-desempenho-trafego';

export type DesempenhoTrafego = {
  inicio: string;
  fim: string;
  total: Omit<LinhaDesempenhoTrafego, 'campanhaId' | 'nome' | 'plataforma'>;
  campanhas: LinhaDesempenhoTrafego[];
  mensagem: string;
};
