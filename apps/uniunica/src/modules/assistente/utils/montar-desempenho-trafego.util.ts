import { type DesempenhoTrafego } from 'src/modules/assistente/types/desempenho-trafego';
import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type LinhaDesempenhoTrafego } from 'src/modules/assistente/types/linha-desempenho-trafego';
import { arredondarReais } from 'src/modules/assistente/utils/arredondar-reais.util';
import { calcularRoi } from 'src/modules/assistente/utils/calcular-roi.util';
import { formatarPercentualPontos } from 'src/modules/assistente/utils/formatar-percentual-pontos.util';
import { formatarPeriodo } from 'src/modules/assistente/utils/formatar-periodo.util';
import { normalizarTextoBusca } from 'src/modules/assistente/utils/normalizar-texto-busca.util';
import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';
import { calcularIndicadores } from 'src/modules/trafego/utils/calcular-indicadores.util';
import { filtrarPorPeriodo } from 'src/modules/trafego/utils/filtrar-por-periodo.util';
import { formatarMoedaBrl } from 'src/modules/trafego/utils/formatar-moeda-brl.util';
import { formatarRoas } from 'src/modules/trafego/utils/formatar-roas.util';
import { montarLinhasPainel } from 'src/modules/trafego/utils/montar-linhas-painel.util';
import { somarMetricas } from 'src/modules/trafego/utils/somar-metricas.util';

const LIMITE_CAMPANHAS_MENSAGEM = 10;

const formatarRoi = (roi: number | null): string => (roi === null ? '—' : formatarPercentualPontos(roi * 100));

// Mesmos números do painel de Tráfego (montarLinhasPainel + calcularIndicadores), mais o ROI.
export const montarDesempenhoTrafego = ({
  campanhas,
  metricas,
  vendas,
  intervalo,
  campanhaBusca,
}: {
  campanhas: CampanhaResumo[];
  metricas: LinhaMetrica[];
  vendas: VendaResumo[];
  intervalo: IntervaloIso;
  campanhaBusca: string | null;
}): DesempenhoTrafego => {
  const metricasPeriodo = filtrarPorPeriodo(metricas, intervalo.inicio, intervalo.fim);
  const termo = campanhaBusca ? normalizarTextoBusca(campanhaBusca) : null;
  const linhasPainel = montarLinhasPainel({ campanhas, metricas: metricasPeriodo, vendas }).filter(
    (linha) => termo === null || normalizarTextoBusca(linha.nome).includes(termo),
  );

  const linhas = linhasPainel.map((linha): LinhaDesempenhoTrafego => {
    const gasto = arredondarReais(linha.totais.gasto);
    const receita = arredondarReais(linha.receita);

    return {
      campanhaId: linha.campanhaId,
      nome: linha.nome,
      plataforma: linha.plataforma,
      gasto,
      receita,
      vendas: linha.vendas,
      roas: linha.indicadores.roas,
      roi: calcularRoi(receita, gasto),
      cpa: linha.indicadores.cpa,
    };
  });

  const totais = somarMetricas(linhasPainel.map((linha) => linha.totais));
  const receita = linhasPainel.reduce((soma, linha) => soma + linha.receita, 0);
  const quantidadeVendas = linhasPainel.reduce((soma, linha) => soma + linha.vendas, 0);
  // Mesmo critério do painel: vendas aprovadas, ou conversões quando a campanha não tem vendas.
  const aquisicoes = linhasPainel.reduce(
    (soma, linha) => soma + (linha.vendas > 0 ? linha.vendas : linha.totais.conversoes),
    0,
  );
  const indicadores = calcularIndicadores({ totais, receita, vendas: quantidadeVendas, aquisicoes });
  const gastoTotal = arredondarReais(totais.gasto);
  const receitaTotal = arredondarReais(receita);
  const total = {
    gasto: gastoTotal,
    receita: receitaTotal,
    vendas: quantidadeVendas,
    roas: indicadores.roas,
    roi: calcularRoi(receitaTotal, gastoTotal),
    cpa: indicadores.cpa,
  };

  if (linhas.length === 0) {
    return {
      inicio: intervalo.inicio,
      fim: intervalo.fim,
      total,
      campanhas: [],
      mensagem: `Sem dados de tráfego em ${formatarPeriodo(intervalo)}${campanhaBusca ? ` para "${campanhaBusca}"` : ''}.`,
    };
  }

  const linhasMensagem = linhas
    .slice(0, LIMITE_CAMPANHAS_MENSAGEM)
    .map(
      (linha) =>
        `- ${linha.nome}: gasto ${formatarMoedaBrl(linha.gasto)}, receita ${formatarMoedaBrl(linha.receita)}, ROAS ${formatarRoas(linha.roas)}, ROI ${formatarRoi(linha.roi)}, CPA ${formatarMoedaBrl(linha.cpa)}, ${linha.vendas} venda(s).`,
    );

  return {
    inicio: intervalo.inicio,
    fim: intervalo.fim,
    total,
    campanhas: linhas,
    mensagem: [
      `Tráfego de ${formatarPeriodo(intervalo)}: gasto ${formatarMoedaBrl(total.gasto)}, receita atribuída ${formatarMoedaBrl(total.receita)}, ROAS ${formatarRoas(total.roas)}, ROI ${formatarRoi(total.roi)}, CPA ${formatarMoedaBrl(total.cpa)}, ${total.vendas} venda(s).`,
      ...linhasMensagem,
    ].join('\n'),
  };
};
