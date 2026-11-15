import { SEM_CAMPANHA } from 'src/modules/trafego/constants/trafego-constantes';
import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type LinhaPainelCampanha } from 'src/modules/trafego/types/linha-painel-campanha';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';
import { agregarPorCampanha } from 'src/modules/trafego/utils/agregar-por-campanha.util';
import { calcularIndicadores } from 'src/modules/trafego/utils/calcular-indicadores.util';
import { somarReceitaPorCampanha } from 'src/modules/trafego/utils/somar-receita-por-campanha.util';
import { totaisVazios } from 'src/modules/trafego/utils/totais-vazios.util';

// Uma linha por campanha (com dado no período ou venda), ordenada por gasto e receita.
export const montarLinhasPainel = ({
  campanhas,
  metricas,
  vendas,
}: {
  campanhas: CampanhaResumo[];
  metricas: LinhaMetrica[];
  vendas: VendaResumo[];
}): LinhaPainelCampanha[] => {
  const totaisPorCampanha = agregarPorCampanha(metricas);
  const receitaPorCampanha = somarReceitaPorCampanha(vendas);
  const campanhaPorId = new Map(campanhas.map((campanha) => [campanha.id, campanha]));

  const ids = new Set<string>([
    ...Object.keys(totaisPorCampanha),
    ...Object.keys(receitaPorCampanha),
  ]);

  const linhas: LinhaPainelCampanha[] = [...ids].map((id) => {
    const campanha = id === SEM_CAMPANHA ? undefined : campanhaPorId.get(id);
    const totais = totaisPorCampanha[id] ?? totaisVazios();
    const { receita, vendas: quantidadeVendas } = receitaPorCampanha[id] ?? {
      receita: 0,
      vendas: 0,
    };

    return {
      campanhaId: id === SEM_CAMPANHA ? null : id,
      nome:
        id === SEM_CAMPANHA
          ? 'Sem campanha (site/orgânico)'
          : (campanha?.nome ?? 'Campanha sem nome'),
      plataforma: campanha?.plataforma ?? null,
      status: campanha?.status ?? null,
      totais,
      receita,
      vendas: quantidadeVendas,
      indicadores: calcularIndicadores({ totais, receita, vendas: quantidadeVendas }),
    };
  });

  return linhas.sort(
    (a, b) => b.totais.gasto - a.totais.gasto || b.receita - a.receita,
  );
};
