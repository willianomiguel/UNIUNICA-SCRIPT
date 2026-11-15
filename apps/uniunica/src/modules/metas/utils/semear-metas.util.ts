import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { calcularTrimestre } from 'src/modules/metas/utils/calcular-trimestre.util';

// Cria um OKR de exemplo do trimestre atual (objetivo + 2 resultados-chave,
// um deles automático pelo faturamento). Busca por título + período: não duplica.
export const semearMetas = async (cliente: ClienteRest, hoje: string): Promise<number> => {
  const { periodo, dataInicio, dataFim } = calcularTrimestre(hoje);
  const existentes = await listarRegistros(cliente, 'metas');
  const idPorTitulo = new Map(
    existentes
      .filter((meta) => meta.periodo === periodo)
      .map((meta) => [String(meta.titulo), meta.id]),
  );
  let criadas = 0;

  const garantir = async (dados: Record<string, unknown> & { titulo: string }) => {
    const existente = idPorTitulo.get(dados.titulo);

    if (existente) return existente;

    const criada = extrairRegistroResposta(
      await cliente.post('/rest/metas', { periodo, dataInicio, dataFim, ...dados }),
    );

    criadas += 1;

    return criada?.id ?? null;
  };

  const objetivoId = await garantir({
    titulo: `Crescer as vendas no ${periodo.replace('-T', ' – ')}º trimestre`,
    descricao: 'Objetivo do trimestre. O progresso é a média dos resultados-chave.',
    fonte: 'MANUAL',
    unidade: 'PERCENTUAL',
    valorInicial: 0,
    valorAlvo: 100,
  });

  await garantir({
    titulo: 'Faturamento do trimestre',
    descricao: 'Soma do valor das vendas aprovadas no período (atualizado automaticamente).',
    fonte: 'FATURAMENTO_BRUTO',
    unidade: 'REAIS',
    valorInicial: 0,
    valorAlvo: 150000,
    metaPaiId: objetivoId,
  });

  await garantir({
    titulo: 'Publicar 12 conteúdos de aquisição',
    descricao: 'Atualize o valor atual manualmente a cada conteúdo publicado.',
    fonte: 'MANUAL',
    unidade: 'QUANTIDADE',
    valorInicial: 0,
    valorAlvo: 12,
    valorAtual: 4,
    metaPaiId: objetivoId,
  });

  return criadas;
};
