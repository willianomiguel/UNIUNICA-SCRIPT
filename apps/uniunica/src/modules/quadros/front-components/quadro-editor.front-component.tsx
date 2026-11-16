import {
  type KeyboardEvent,
  type PointerEvent,
  type SyntheticEvent,
  type WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { LightButton } from 'twenty-ui/components/input';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Textarea } from 'twenty-ui/primitives/input';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme, useThemeColorScheme } from 'twenty-ui/theme';

import { COR_PADRAO_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import {
  ATALHOS_FERRAMENTAS,
  BarraFerramentasQuadro,
  ControlesTopoQuadro,
  IndicadorSalvamento,
} from 'src/modules/quadros/front-components/components/BarraFerramentasQuadro';
import {
  type AcaoMenuQuadro,
  MenuContextoQuadro,
} from 'src/modules/quadros/front-components/components/MenuContextoQuadro';
import { PainelIaQuadro } from 'src/modules/quadros/front-components/components/PainelIaQuadro';
import { ElementoSvg, TAMANHO_FONTE_QUADRO } from 'src/modules/quadros/front-components/components/ElementoSvg';
import { type StatusSalvamento, useQuadroRemoto } from 'src/modules/quadros/front-components/hooks/use-quadro-remoto';
import { OBJECTS } from 'src/modules/shared/constants/objects';
import { type AlcaRedimensionar } from 'src/modules/quadros/types/alca-redimensionar';
import { type CameraQuadro } from 'src/modules/quadros/types/camera-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type FerramentaQuadro } from 'src/modules/quadros/types/ferramenta-quadro';
import { type HistoricoQuadro } from 'src/modules/quadros/types/historico-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import {
  colarElementos,
  duplicarElementos,
  enviarParaTras,
  envolverEmMoldura,
  trazerParaFrente,
} from 'src/modules/quadros/utils/acoes-elementos-quadro.util';
import { atualizarSetasLigadas, centroDaCaixa } from 'src/modules/quadros/utils/ancorar-seta.util';
import {
  ajustarCameraACaixa,
  CAMERA_INICIAL,
  clienteParaTela,
  moverCamera,
  quadroParaTela,
  telaParaQuadro,
  zoomNoPonto,
} from 'src/modules/quadros/utils/camera-quadro.util';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import {
  atualizarElemento,
  caixaEntrePontos,
  criarForma,
  criarLinha,
  ehTipoForma,
  expandirComConteudoDasMolduras,
  moverElementos,
  proximoZ,
  removerElementosPorId,
} from 'src/modules/quadros/utils/editar-elementos-quadro.util';
import { gerarIdQuadro } from 'src/modules/quadros/utils/gerar-id-quadro.util';
import {
  criarHistorico,
  desfazer,
  refazer,
  registrarNoHistorico,
} from 'src/modules/quadros/utils/historico-quadro.util';
import { aplicarCaixa, posicaoDaAlca, redimensionarCaixa } from 'src/modules/quadros/utils/redimensionar-elemento.util';
import { simplificarTraco } from 'src/modules/quadros/utils/simplificar-traco.util';
import { ehFormaLigavel, elementoNoPonto } from 'src/modules/quadros/utils/testar-acerto-quadro.util';

const ALCAS: AlcaRedimensionar[] = ['no', 'ne', 'so', 'se'];
const TAMANHO_ALCA = 8;
const ESPACO_GRADE = 24;

type Interacao =
  | { tipo: 'pan'; ultimo: PontoQuadro }
  | { tipo: 'mover'; inicio: PontoQuadro; base: ElementoQuadro[]; ids: Set<string>; moveu: boolean }
  | { tipo: 'redimensionar'; id: string; alca: AlcaRedimensionar; base: ElementoQuadro[] }
  | { tipo: 'criar'; forma: 'retangulo' | 'elipse' | 'nota' | 'texto' | 'moldura'; inicio: PontoQuadro }
  | { tipo: 'seta'; inicio: PontoQuadro; deId?: string }
  | { tipo: 'traco'; pontos: PontoQuadro[] }
  | { tipo: 'caixa'; inicio: PontoQuadro };

type Previa =
  | { tipo: 'forma'; forma: 'retangulo' | 'elipse' | 'nota' | 'texto' | 'moldura'; inicio: PontoQuadro; fim: PontoQuadro }
  | { tipo: 'seta'; inicio: PontoQuadro; fim: PontoQuadro; paraId?: string }
  | { tipo: 'traco'; pontos: PontoQuadro[] }
  | { tipo: 'caixa'; inicio: PontoQuadro; fim: PontoQuadro };

type DadosEvento = {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  button: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  deltaY: number;
  botoes: number | null;
};

// No sandbox os campos do evento chegam copiados no nativeEvent do worker.
const lerEvento = (evento: SyntheticEvent): DadosEvento => {
  const nativo = evento.nativeEvent as unknown as Partial<DadosEvento>;
  const sintetico = evento as unknown as Partial<DadosEvento>;
  const numero = (chave: 'clientX' | 'clientY' | 'offsetX' | 'offsetY' | 'button' | 'deltaY') => {
    const valor = nativo[chave] ?? sintetico[chave];

    return typeof valor === 'number' ? valor : 0;
  };

  return {
    clientX: numero('clientX'),
    clientY: numero('clientY'),
    offsetX: numero('offsetX'),
    offsetY: numero('offsetY'),
    button: numero('button'),
    deltaY: numero('deltaY'),
    botoes: typeof (nativo as { buttons?: unknown }).buttons === 'number' ? (nativo as { buttons: number }).buttons : null,
    shiftKey: nativo.shiftKey === true || sintetico.shiftKey === true,
    ctrlKey: nativo.ctrlKey === true || sintetico.ctrlKey === true,
    metaKey: nativo.metaKey === true || sintetico.metaKey === true,
  };
};

const textoDoIndicador = (status: StatusSalvamento): string => {
  switch (status) {
    case 'salvando':
      return 'Salvando…';
    case 'pendente':
      return 'Alterações não salvas';
    case 'erro':
      return 'Erro ao salvar';
    default:
      return 'Salvo';
  }
};

const QuadroEditor = () => {
  const theme = useTheme();
  const esquema = useThemeColorScheme();
  const recordId = useRecordId();

  const [historico, setHistorico] = useState<HistoricoQuadro>(() => criarHistorico([]));
  const [elementosTemporarios, setElementosTemporarios] = useState<ElementoQuadro[] | null>(null);
  const [selecao, setSelecao] = useState<Set<string>>(new Set());
  const [ferramenta, setFerramenta] = useState<FerramentaQuadro>('selecionar');
  const [cor, setCor] = useState<CorQuadro>(COR_PADRAO_QUADRO);
  const [camera, setCamera] = useState<CameraQuadro>(CAMERA_INICIAL);
  const [previa, setPrevia] = useState<Previa | null>(null);
  const [edicao, setEdicao] = useState<{ id: string; texto: string } | null>(null);
  const [tamanho, setTamanho] = useState<{ largura: number; altura: number }>({ largura: 0, altura: 0 });
  const [espacoPressionado, setEspacoPressionado] = useState(false);

  const [iaAberta, setIaAberta] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number; quadro: PontoQuadro } | null>(null);
  // Área de transferência interna (a do sistema não chega ao worker de forma confiável).
  const copiadosRef = useRef<ElementoQuadro[]>([]);
  const [temCopiados, setTemCopiados] = useState(false);
  const idEmEdicao = edicao?.id ?? null;

  // autoFocus não funciona no sandbox: foca o campo depois que ele aparece na tela.
  useEffect(() => {
    if (idEmEdicao === null) {
      return;
    }

    const temporizador = setTimeout(() => campoTextoRef.current?.focus(), 30);

    return () => clearTimeout(temporizador);
  }, [idEmEdicao]);
  const temporariosRef = useRef<ElementoQuadro[] | null>(null);
  const historicoRef = useRef(historico);
  const cameraRef = useRef(camera);
  const interacaoRef = useRef<Interacao | null>(null);
  const origemRef = useRef<PontoQuadro | null>(null);
  const fundoRef = useRef<SVGRectElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const campoTextoRef = useRef<HTMLTextAreaElement | null>(null);
  const cameraInicialRef = useRef<CameraQuadro | undefined>(undefined);
  const enquadradoRef = useRef(false);

  historicoRef.current = historico;
  cameraRef.current = camera;

  // O estado de arraste fica num ref: os eventos chegam do worker fora de ordem de render.
  const mostrarTemporarios = (lista: ElementoQuadro[] | null) => {
    temporariosRef.current = lista;
    setElementosTemporarios(lista);
  };

  const elementos = elementosTemporarios ?? historico.presente;
  // Molduras sempre atrás do conteúdo; dentro de cada grupo vale o z.
  const elementosOrdenados = useMemo(
    () =>
      [...elementos].sort(
        (a, b) => Number(b.tipo === 'moldura') - Number(a.tipo === 'moldura') || a.z - b.z,
      ),
    [elementos],
  );

  const aoRecarregar = useCallback((conteudo: ConteudoQuadro) => {
    const novo = criarHistorico(conteudo.elementos);

    historicoRef.current = novo;
    setHistorico(novo);
    temporariosRef.current = null;
    setElementosTemporarios(null);
    setEdicao(null);
    setSelecao((atual) => new Set([...atual].filter((id) => conteudo.elementos.some((elemento) => elemento.id === id))));
  }, []);

  const remoto = useQuadroRemoto({
    recordId,
    estaInteragindo: () => interacaoRef.current !== null || edicao !== null,
    aoRecarregar,
  });

  // Ao carregar: usa a câmera salva (se houver) ou enquadra o desenho quando o tamanho da área for conhecido.
  useEffect(() => {
    if (remoto.carregamento.tipo !== 'pronto') {
      return;
    }

    const conteudo = remoto.carregamento.registro.conteudo;
    const novo = criarHistorico(conteudo.elementos);

    historicoRef.current = novo;
    setHistorico(novo);
    setSelecao(new Set());
    cameraInicialRef.current = conteudo.camera;
    enquadradoRef.current = false;
  }, [remoto.carregamento]);

  useEffect(() => {
    if (remoto.carregamento.tipo !== 'pronto' || enquadradoRef.current || tamanho.largura === 0) {
      return;
    }

    enquadradoRef.current = true;
    setCamera(
      cameraInicialRef.current ??
        ajustarCameraACaixa(caixaDosElementos(historicoRef.current.presente), tamanho.largura, tamanho.altura),
    );
  }, [remoto.carregamento, tamanho]);

  useEffect(() => {
    const area = areaRef.current;

    if (area === null || typeof ResizeObserver === 'undefined') {
      setTamanho({ largura: 800, altura: 600 });

      return;
    }

    const observador = new ResizeObserver((entradas) => {
      const caixa = entradas[0]?.contentRect;

      if (caixa && caixa.width > 0 && caixa.height > 0) {
        setTamanho({ largura: caixa.width, altura: caixa.height });
      }
    });

    observador.observe(area);

    return () => observador.disconnect();
  }, [remoto.carregamento.tipo]);

  const aplicar = useCallback(
    (novos: ElementoQuadro[]) => {
      const novo = registrarNoHistorico(historicoRef.current, novos);

      historicoRef.current = novo;
      setHistorico(novo);
      remoto.agendarSalvamento(novo.presente);
    },
    [remoto.agendarSalvamento],
  );

  const mudarHistorico = useCallback(
    (mudar: (atual: HistoricoQuadro) => HistoricoQuadro) => {
      const novo = mudar(historicoRef.current);

      if (novo === historicoRef.current) {
        return;
      }
      historicoRef.current = novo;
      setHistorico(novo);
      setSelecao(new Set());
      remoto.agendarSalvamento(novo.presente);
    },
    [remoto.agendarSalvamento],
  );

  // O sandbox não repassa offsetX (chega 0): a posição vem de clientX menos o canto da área,
  // lido do getBoundingClientRect que o renderer simula para elementos observados (a área tem ResizeObserver).
  const atualizarOrigem = () => {
    const retangulo = areaRef.current?.getBoundingClientRect();

    if (retangulo && retangulo.width > 0) {
      origemRef.current = [retangulo.left, retangulo.top];
    }
  };

  const lerPonto = (evento: SyntheticEvent, renovarOrigem = false) => {
    const dados = lerEvento(evento);

    if (renovarOrigem || origemRef.current === null) {
      atualizarOrigem();
    }

    const tela = clienteParaTela([dados.clientX, dados.clientY], origemRef.current ?? [0, 0]);

    return { dados, tela, quadro: telaParaQuadro(tela, cameraRef.current) };
  };

  // No máximo uma atualização de tela por quadro (~60/s) durante arrastes: o worker não aguenta uma por evento.
  const agendarQuadroRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tarefaQuadroRef = useRef<(() => void) | null>(null);
  const noProximoQuadro = (tarefa: () => void) => {
    tarefaQuadroRef.current = tarefa;
    if (agendarQuadroRef.current !== null) {
      return;
    }
    agendarQuadroRef.current = setTimeout(() => {
      agendarQuadroRef.current = null;
      const pendente = tarefaQuadroRef.current;

      tarefaQuadroRef.current = null;
      pendente?.();
    }, 16);
  };
  const descartarQuadroPendente = () => {
    if (agendarQuadroRef.current !== null) {
      clearTimeout(agendarQuadroRef.current);
      agendarQuadroRef.current = null;
    }
    tarefaQuadroRef.current = null;
  };

  const confirmarEdicao = useCallback(() => {
    if (edicao === null) {
      return;
    }

    const texto = edicao.texto.slice(0, LIMITES_QUADRO.textoMaximo);
    const atual = historicoRef.current.presente.find((elemento) => elemento.id === edicao.id);

    setEdicao(null);
    if (atual === undefined || atual.tipo === 'traco') {
      return;
    }
    // Texto solto vazio ficaria invisível no quadro: some em vez de virar lixo.
    if (atual.tipo === 'texto' && texto.trim() === '') {
      aplicar(removerElementosPorId(historicoRef.current.presente, new Set([atual.id])));
      setSelecao(new Set());

      return;
    }
    // Título de moldura apagado mantém o anterior (ex.: "Nova seção").
    if ((atual.texto ?? '') === texto || (atual.tipo === 'moldura' && texto.trim() === '')) {
      return;
    }
    aplicar(atualizarElemento(historicoRef.current.presente, edicao.id, (elemento) => ({ ...elemento, texto }) as ElementoQuadro));
  }, [edicao, aplicar]);

  const apagarSelecao = useCallback(() => {
    if (selecao.size === 0) {
      return;
    }
    aplicar(removerElementosPorId(historicoRef.current.presente, selecao));
    setSelecao(new Set());
  }, [selecao, aplicar]);

  const focarArea = () => containerRef.current?.focus();

  const redimensionarNaBase = (
    interacao: Extract<Interacao, { tipo: 'redimensionar' }>,
    ponto: PontoQuadro,
  ): ElementoQuadro[] =>
    atualizarSetasLigadas(
      interacao.base.map((elemento) =>
        elemento.id === interacao.id ? aplicarCaixa(elemento, redimensionarCaixa(elemento, interacao.alca, ponto)) : elemento,
      ),
    );

  const copiarSelecao = () => {
    const escolhidos = historicoRef.current.presente.filter((elemento) => selecao.has(elemento.id));

    if (escolhidos.length > 0) {
      copiadosRef.current = escolhidos;
      setTemCopiados(true);
    }
  };

  const colar = (ponto?: PontoQuadro) => {
    if (copiadosRef.current.length === 0) {
      return;
    }

    const resultado = colarElementos(historicoRef.current.presente, copiadosRef.current, gerarIdQuadro, ponto);

    aplicar(resultado.elementos);
    setSelecao(new Set(resultado.idsNovos));
  };

  const duplicar = () => {
    if (selecao.size === 0) {
      return;
    }

    const resultado = duplicarElementos(historicoRef.current.presente, selecao, gerarIdQuadro);

    aplicar(resultado.elementos);
    setSelecao(new Set(resultado.idsNovos));
  };

  const agruparEmMoldura = () => {
    if (selecao.size === 0) {
      return;
    }

    const id = gerarIdQuadro();

    aplicar(envolverEmMoldura(historicoRef.current.presente, selecao, id));
    setSelecao(new Set([id]));
    setEdicao({ id, texto: '' });
  };

  const criarNoPonto = (tipo: 'nota' | 'texto' | 'moldura', ponto: PontoQuadro) => {
    const atuais = historicoRef.current.presente;
    const novo = criarForma({ id: gerarIdQuadro(), tipo, inicio: ponto, fim: ponto, cor, z: proximoZ(atuais) });

    aplicar([...atuais, novo]);
    setSelecao(new Set([novo.id]));
    setEdicao({ id: novo.id, texto: '' });
  };

  const executarAcaoMenu = (acao: AcaoMenuQuadro) => {
    const ponto = menu?.quadro;

    setMenu(null);
    focarArea();

    switch (acao) {
      case 'editarTexto': {
        const [id] = [...selecao];
        const alvo = historicoRef.current.presente.find((elemento) => elemento.id === id);

        if (alvo !== undefined && alvo.tipo !== 'traco') {
          setEdicao({ id: alvo.id, texto: alvo.texto ?? '' });
        }
        break;
      }
      case 'duplicar':
        duplicar();
        break;
      case 'copiar':
        copiarSelecao();
        break;
      case 'colar':
        colar(ponto);
        break;
      case 'frente':
        aplicar(trazerParaFrente(historicoRef.current.presente, selecao));
        break;
      case 'tras':
        aplicar(enviarParaTras(historicoRef.current.presente, selecao));
        break;
      case 'moldura':
        agruparEmMoldura();
        break;
      case 'apagar':
        apagarSelecao();
        break;
      case 'novaNota':
      case 'novoTexto':
      case 'novaMoldura':
        if (ponto) {
          criarNoPonto(acao === 'novaNota' ? 'nota' : acao === 'novoTexto' ? 'texto' : 'moldura', ponto);
        }
        break;
      case 'selecionarTudo':
        setSelecao(new Set(historicoRef.current.presente.map((elemento) => elemento.id)));
        break;
      case 'ajustar':
        ajustarATela();
        break;
      case 'desfazer':
        mudarHistorico(desfazer);
        break;
      case 'ia':
        setIaAberta(true);
        break;
    }
  };

  const aoAbrirMenu = (evento: SyntheticEvent) => {
    evento.preventDefault();
    if (edicao !== null) {
      confirmarEdicao();
    }

    const { tela, quadro } = lerPonto(evento, true);
    const acerto = elementoNoPonto(historicoRef.current.presente, quadro, 6 / cameraRef.current.zoom);

    interacaoRef.current = null;
    if (acerto === null) {
      setSelecao(new Set());
    } else if (!selecao.has(acerto.id)) {
      setSelecao(new Set([acerto.id]));
    }
    setMenu({ x: tela[0], y: tela[1], quadro });
  };

  const aoPressionar = (evento: PointerEvent<SVGSVGElement>) => {
    focarArea();
    if (edicao !== null) {
      confirmarEdicao();
    }

    const { dados, tela, quadro } = lerPonto(evento, true);
    const zoom = cameraRef.current.zoom;
    const atuais = historicoRef.current.presente;

    if (dados.button === 1 || ferramenta === 'mao' || espacoPressionado) {
      interacaoRef.current = { tipo: 'pan', ultimo: tela };

      return;
    }
    if (dados.button !== 0) {
      return;
    }
    setMenu(null);

    if (ferramenta === 'selecionar') {
      if (selecao.size === 1) {
        const [idSelecionado] = [...selecao];
        const selecionado = atuais.find((elemento) => elemento.id === idSelecionado);

        if (selecionado !== undefined && selecionado.tipo !== 'seta') {
          const alca = ALCAS.find((candidata) => {
            const [ax, ay] = posicaoDaAlca(selecionado, candidata);

            return Math.abs(ax - quadro[0]) <= TAMANHO_ALCA / zoom && Math.abs(ay - quadro[1]) <= TAMANHO_ALCA / zoom;
          });

          if (alca !== undefined) {
            interacaoRef.current = { tipo: 'redimensionar', id: selecionado.id, alca, base: atuais };

            return;
          }
        }
      }

      const acerto = elementoNoPonto(atuais, quadro, 6 / zoom);

      if (acerto === null) {
        if (!dados.shiftKey) {
          setSelecao(new Set());
        }
        interacaoRef.current = { tipo: 'caixa', inicio: quadro };

        return;
      }

      let novaSelecao = selecao;

      if (dados.shiftKey) {
        novaSelecao = new Set(selecao);
        if (novaSelecao.has(acerto.id)) {
          novaSelecao.delete(acerto.id);
        } else {
          novaSelecao.add(acerto.id);
        }
      } else if (!selecao.has(acerto.id)) {
        novaSelecao = new Set([acerto.id]);
      }
      setSelecao(novaSelecao);
      interacaoRef.current = {
        tipo: 'mover',
        inicio: quadro,
        base: atuais,
        ids: expandirComConteudoDasMolduras(atuais, novaSelecao),
        moveu: false,
      };

      return;
    }

    if (ehTipoForma(ferramenta)) {
      interacaoRef.current = { tipo: 'criar', forma: ferramenta, inicio: quadro };
      setPrevia({ tipo: 'forma', forma: ferramenta, inicio: quadro, fim: quadro });

      return;
    }

    if (ferramenta === 'seta') {
      const origem = elementoNoPonto(atuais, quadro, 6 / zoom, ehFormaLigavel);
      const inicio = origem !== null ? centroDaCaixa(origem) : quadro;

      interacaoRef.current = { tipo: 'seta', inicio, ...(origem !== null ? { deId: origem.id } : {}) };
      setPrevia({ tipo: 'seta', inicio, fim: quadro });

      return;
    }

    if (ferramenta === 'traco') {
      interacaoRef.current = { tipo: 'traco', pontos: [quadro] };
      setPrevia({ tipo: 'traco', pontos: [quadro] });
    }
  };

  const aoMover = (evento: PointerEvent<SVGSVGElement>) => {
    const interacao = interacaoRef.current;

    if (interacao === null) {
      return;
    }

    // Botão já solto (soltou fora da área): termina o gesto aqui.
    if (lerEvento(evento).botoes === 0) {
      aoSoltar(evento);

      return;
    }

    const { tela, quadro } = lerPonto(evento);

    switch (interacao.tipo) {
      case 'pan': {
        const dx = tela[0] - interacao.ultimo[0];
        const dy = tela[1] - interacao.ultimo[1];

        interacao.ultimo = tela;
        cameraRef.current = moverCamera(cameraRef.current, dx, dy);
        noProximoQuadro(() => setCamera(cameraRef.current));
        break;
      }
      case 'mover': {
        const dx = quadro[0] - interacao.inicio[0];
        const dy = quadro[1] - interacao.inicio[1];

        if (!interacao.moveu && Math.hypot(dx, dy) * cameraRef.current.zoom < 2) {
          break;
        }
        interacao.moveu = true;
        noProximoQuadro(() => mostrarTemporarios(moverElementos(interacao.base, interacao.ids, dx, dy)));
        break;
      }
      case 'redimensionar':
        noProximoQuadro(() => mostrarTemporarios(redimensionarNaBase(interacao, quadro)));
        break;
      case 'criar':
        noProximoQuadro(() => setPrevia({ tipo: 'forma', forma: interacao.forma, inicio: interacao.inicio, fim: quadro }));
        break;
      case 'seta': {
        const destino = elementoNoPonto(
          historicoRef.current.presente,
          quadro,
          6 / cameraRef.current.zoom,
          (elemento) => ehFormaLigavel(elemento) && elemento.id !== interacao.deId,
        );

        noProximoQuadro(() =>
          setPrevia({ tipo: 'seta', inicio: interacao.inicio, fim: quadro, ...(destino ? { paraId: destino.id } : {}) }),
        );
        break;
      }
      case 'traco': {
        const ultimo = interacao.pontos[interacao.pontos.length - 1];

        if (
          interacao.pontos.length < LIMITES_QUADRO.pontosPorTraco &&
          Math.hypot(quadro[0] - ultimo[0], quadro[1] - ultimo[1]) * cameraRef.current.zoom >= 2
        ) {
          interacao.pontos.push(quadro);
          noProximoQuadro(() => setPrevia({ tipo: 'traco', pontos: [...interacao.pontos] }));
        }
        break;
      }
      case 'caixa':
        noProximoQuadro(() => setPrevia({ tipo: 'caixa', inicio: interacao.inicio, fim: quadro }));
        break;
    }
  };

  const aoSoltar = (evento: PointerEvent<SVGSVGElement>) => {
    const interacao = interacaoRef.current;

    interacaoRef.current = null;
    descartarQuadroPendente();
    if (interacao === null) {
      return;
    }

    const { quadro } = lerPonto(evento);
    const atuais = historicoRef.current.presente;
    const zoom = cameraRef.current.zoom;

    setPrevia(null);

    switch (interacao.tipo) {
      case 'mover': {
        // Recalcula com o ponto final: o último pointermove pode não ter chegado.
        const dx = quadro[0] - interacao.inicio[0];
        const dy = quadro[1] - interacao.inicio[1];

        if (interacao.moveu || Math.hypot(dx, dy) * zoom >= 2) {
          aplicar(moverElementos(interacao.base, interacao.ids, dx, dy));
        }
        mostrarTemporarios(null);
        break;
      }
      case 'redimensionar':
        aplicar(redimensionarNaBase(interacao, quadro));
        mostrarTemporarios(null);
        break;
      case 'pan':
        setCamera(cameraRef.current);
        break;
      case 'criar': {
        const novo = criarForma({
          id: gerarIdQuadro(),
          tipo: interacao.forma,
          inicio: interacao.inicio,
          fim: quadro,
          cor,
          z: proximoZ(atuais),
        });

        aplicar([...atuais, novo]);
        setSelecao(new Set([novo.id]));
        setFerramenta('selecionar');
        if (novo.tipo === 'nota' || novo.tipo === 'texto' || novo.tipo === 'moldura') {
          setEdicao({ id: novo.id, texto: '' });
        }
        break;
      }
      case 'seta': {
        const destino = elementoNoPonto(
          atuais,
          quadro,
          6 / zoom,
          (elemento) => ehFormaLigavel(elemento) && elemento.id !== interacao.deId,
        );
        const fim = destino !== null ? centroDaCaixa(destino) : quadro;

        if (destino === null && Math.hypot(fim[0] - interacao.inicio[0], fim[1] - interacao.inicio[1]) * zoom < 10) {
          break;
        }

        const seta = criarLinha({
          id: gerarIdQuadro(),
          tipo: 'seta',
          pontos: [interacao.inicio, fim],
          cor,
          z: proximoZ(atuais),
          deId: interacao.deId,
          paraId: destino?.id,
        });

        aplicar(atualizarSetasLigadas([...atuais, seta]));
        setSelecao(new Set([seta.id]));
        setFerramenta('selecionar');
        break;
      }
      case 'traco': {
        const pontos = simplificarTraco(interacao.pontos, 1 / zoom);

        if (pontos.length >= 2) {
          aplicar([...atuais, criarLinha({ id: gerarIdQuadro(), tipo: 'traco', pontos, cor, z: proximoZ(atuais) })]);
        }
        break;
      }
      case 'caixa': {
        const caixa = caixaEntrePontos(interacao.inicio, quadro);

        if (caixa.largura * zoom < 4 && caixa.altura * zoom < 4) {
          break;
        }

        const dentro = atuais.filter(
          (elemento) =>
            elemento.x >= caixa.x &&
            elemento.y >= caixa.y &&
            elemento.x + elemento.largura <= caixa.x + caixa.largura &&
            elemento.y + elemento.altura <= caixa.y + caixa.altura,
        );

        setSelecao(new Set(dentro.map((elemento) => elemento.id)));
        break;
      }
      default:
        break;
    }
  };

  const aoClicarDuasVezes = (evento: SyntheticEvent) => {
    const { quadro } = lerPonto(evento, true);

    setFerramenta('selecionar');
    const atuais = historicoRef.current.presente;
    const acerto = elementoNoPonto(atuais, quadro, 6 / cameraRef.current.zoom);

    if (acerto !== null && acerto.tipo !== 'traco') {
      setSelecao(new Set([acerto.id]));
      setEdicao({ id: acerto.id, texto: acerto.texto ?? '' });

      return;
    }

    if (acerto === null) {
      const novo = criarForma({
        id: gerarIdQuadro(),
        tipo: 'texto',
        inicio: quadro,
        fim: quadro,
        cor,
        z: proximoZ(atuais),
      });

      aplicar([...atuais, novo]);
      setSelecao(new Set([novo.id]));
      setEdicao({ id: novo.id, texto: '' });
    }
  };

  const aoRolar = (evento: WheelEvent<SVGSVGElement>) => {
    const { dados, tela } = lerPonto(evento, true);
    const fator = Math.exp(-dados.deltaY * 0.0015);

    setCamera((atual) => zoomNoPonto(atual, tela, atual.zoom * fator));
  };

  const mudarZoomNoCentro = (fator: number) =>
    setCamera((atual) => zoomNoPonto(atual, [tamanho.largura / 2, tamanho.altura / 2], atual.zoom * fator));

  const ajustarATela = () =>
    setCamera(ajustarCameraACaixa(caixaDosElementos(historicoRef.current.presente), tamanho.largura, tamanho.altura));

  const escolherCor = (novaCor: CorQuadro) => {
    setCor(novaCor);
    if (selecao.size > 0) {
      aplicar(
        historicoRef.current.presente.map((elemento) =>
          selecao.has(elemento.id) ? { ...elemento, cor: novaCor } : elemento,
        ),
      );
    }
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (edicao !== null || evento.target !== containerRef.current) {
      return;
    }

    const comando = evento.ctrlKey || evento.metaKey;
    const tecla = evento.key.toLowerCase();

    const setas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };

    if (evento.key === ' ') {
      if (evento.target === containerRef.current) {
        setEspacoPressionado(true);
      }
    } else if (setas[evento.key] !== undefined && selecao.size > 0) {
      const passo = evento.shiftKey ? 10 : 1;
      const [dx, dy] = setas[evento.key];

      const atuais = historicoRef.current.presente;

      aplicar(moverElementos(atuais, expandirComConteudoDasMolduras(atuais, selecao), dx * passo, dy * passo));
    } else if ((evento.key === 'Enter' || evento.key === 'F2') && selecao.size === 1) {
      const [id] = [...selecao];
      const alvo = historicoRef.current.presente.find((elemento) => elemento.id === id);

      if (alvo !== undefined && alvo.tipo !== 'traco') {
        setEdicao({ id: alvo.id, texto: alvo.texto ?? '' });
      }
    } else if (evento.key === 'Delete' || evento.key === 'Backspace') {
      apagarSelecao();
    } else if (comando && tecla === 'z') {
      mudarHistorico(evento.shiftKey ? refazer : desfazer);
    } else if (comando && tecla === 'y') {
      mudarHistorico(refazer);
    } else if (comando && tecla === 'c') {
      copiarSelecao();
    } else if (comando && tecla === 'v') {
      colar();
    } else if (comando && tecla === 'd') {
      duplicar();
    } else if (comando && tecla === 'g') {
      agruparEmMoldura();
    } else if (!comando && evento.key === ']' && selecao.size > 0) {
      aplicar(trazerParaFrente(historicoRef.current.presente, selecao));
    } else if (!comando && evento.key === '[' && selecao.size > 0) {
      aplicar(enviarParaTras(historicoRef.current.presente, selecao));
    } else if (comando && tecla === 'a') {
      setSelecao(new Set(historicoRef.current.presente.map((elemento) => elemento.id)));
    } else if (evento.key === 'Escape') {
      setSelecao(new Set());
      setFerramenta('selecionar');
    } else if (!comando && !evento.altKey && ATALHOS_FERRAMENTAS[tecla] !== undefined) {
      setFerramenta(ATALHOS_FERRAMENTAS[tecla]);
    }
  };

  const aoSoltarTecla = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === ' ') {
      setEspacoPressionado(false);
    }
  };

  if (remoto.carregamento.tipo === 'carregando') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing[2],
          height: '100%',
          padding: theme.spacing[4],
        }}
      >
        <Loader />
        <Text size="sm" color="tertiary">
          Carregando quadro…
        </Text>
      </div>
    );
  }

  if (remoto.carregamento.tipo === 'erro') {
    return (
      <div style={{ padding: theme.spacing[3] }}>
        <Callout
          status="error"
          title="Não foi possível abrir o quadro"
          description={remoto.carregamento.mensagem}
          action={
            recordId === null ? undefined : (
              <LightButton size="sm" onClick={() => void remoto.carregar()}>
                Tentar de novo
              </LightButton>
            )
          }
        />
      </div>
    );
  }

  const elementoEditado = edicao !== null ? elementos.find((elemento) => elemento.id === edicao.id) : undefined;
  const selecionados = elementos.filter((elemento) => selecao.has(elemento.id));
  const unicoSelecionado = selecionados.length === 1 && selecionados[0].tipo !== 'seta' ? selecionados[0] : null;
  const modoMao = ferramenta === 'mao' || espacoPressionado;
  const cursor = modoMao ? 'grab' : ferramenta === 'selecionar' ? 'default' : 'crosshair';
  const largura = 1 / camera.zoom;
  const corSelecao = theme.color.blue;

  const renderizarEditorTexto = () => {
    if (edicao === null || elementoEditado === undefined || elementoEditado.tipo === 'traco') {
      return null;
    }

    let caixa = { x: elementoEditado.x, y: elementoEditado.y, largura: elementoEditado.largura, altura: elementoEditado.altura };

    if (elementoEditado.tipo === 'seta') {
      const [mx, my] = centroDaCaixa(elementoEditado);

      caixa = { x: mx - 110, y: my - 20, largura: 220, altura: 40 };
    }

    const [tx, ty] = quadroParaTela([caixa.x, caixa.y], camera);

    return (
      <div
        style={{
          position: 'absolute',
          left: tx,
          top: ty,
          width: Math.max(caixa.largura * camera.zoom, 120),
          zIndex: 2,
        }}
      >
        <Textarea
          ref={campoTextoRef}
          aria-label="Texto do elemento"
          autoFocus
          autoResize
          maxRows={12}
          value={edicao.texto}
          maxLength={LIMITES_QUADRO.textoMaximo}
          placeholder="Digite o texto (Ctrl+Enter conclui)"
          onValueChange={(valor) => setEdicao((atual) => (atual === null ? null : { ...atual, texto: valor }))}
          onBlur={confirmarEdicao}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape' || (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey))) {
              confirmarEdicao();
              focarArea();
            }
          }}
          style={{ fontSize: Math.max(TAMANHO_FONTE_QUADRO * camera.zoom, 12) }}
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label="Quadro branco. Atalhos: V selecionar, H mover a tela, R retângulo, O elipse, N nota, T texto, A seta, P caneta, Enter edita o texto, setas movem a seleção."
      onKeyDown={aoTeclar}
      onKeyUp={aoSoltarTecla}
      onBlur={() => {
        setEspacoPressionado(false);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 360,
        outline: 'none',

        color: theme.font.color.primary,
        background: theme.background.primary,
      }}
    >
      <div
        ref={areaRef}
        // O index.html da imagem IntegraCore bloqueia o menu do navegador só dentro desta área (ver infra/branding).
        data-testid="quadro-area-desenho"
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: theme.background.secondary,
          // Grade de pontos que acompanha zoom e pan, como num canvas.
          backgroundImage: `radial-gradient(circle, ${theme.border.color.strong} ${Math.max(0.8, camera.zoom)}px, transparent ${Math.max(0.8, camera.zoom)}px)`,
          backgroundSize: `${ESPACO_GRADE * camera.zoom}px ${ESPACO_GRADE * camera.zoom}px`,
          backgroundPosition: `${-camera.x * camera.zoom}px ${-camera.y * camera.zoom}px`,
        }}
      >
        <svg
          width="100%"
          height="100%"
          aria-hidden
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          onDoubleClick={aoClicarDuasVezes}
          onContextMenu={aoAbrirMenu}
          onWheel={aoRolar}
          style={{ display: 'block', touchAction: 'none', cursor, userSelect: 'none' }}
        >
          <rect ref={fundoRef} x={0} y={0} width="100%" height="100%" style={{ fill: 'transparent' }} />
          <g transform={`scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`}>
            {elementosOrdenados.map((elemento) => (
              <ElementoSvg
                key={elemento.id}
                elemento={elemento}
                theme={theme}
                esquema={esquema}
                ocultarTexto={edicao?.id === elemento.id}
              />
            ))}

            {previa?.tipo === 'forma' && (
              <ElementoSvg
                theme={theme}
                esquema={esquema}
                elemento={criarForma({
                  id: 'previa',
                  tipo: previa.forma,
                  inicio: previa.inicio,
                  fim: previa.fim,
                  cor,
                  z: 0,
                })}
              />
            )}
            {previa?.tipo === 'seta' && (
              <ElementoSvg
                theme={theme}
                esquema={esquema}
                elemento={criarLinha({ id: 'previa', tipo: 'seta', pontos: [previa.inicio, previa.fim], cor, z: 0 })}
              />
            )}
            {previa?.tipo === 'traco' && previa.pontos.length >= 2 && (
              <ElementoSvg
                theme={theme}
                esquema={esquema}
                elemento={criarLinha({ id: 'previa', tipo: 'traco', pontos: previa.pontos, cor, z: 0 })}
              />
            )}
            {previa?.tipo === 'seta' && previa.paraId !== undefined && (() => {
              const alvo = elementos.find((elemento) => elemento.id === previa.paraId);

              return alvo ? (
                <rect
                  x={alvo.x - 4 * largura}
                  y={alvo.y - 4 * largura}
                  width={alvo.largura + 8 * largura}
                  height={alvo.altura + 8 * largura}
                  rx={6 * largura}
                  style={{ fill: 'none', stroke: corSelecao, strokeWidth: 2 * largura }}
                />
              ) : null;
            })()}
            {previa?.tipo === 'caixa' && (() => {
              const caixa = caixaEntrePontos(previa.inicio, previa.fim);

              return (
                <rect
                  x={caixa.x}
                  y={caixa.y}
                  width={caixa.largura}
                  height={caixa.altura}
                  style={{
                    fill: theme.background.transparent.blue,
                    stroke: corSelecao,
                    strokeWidth: largura,
                    strokeDasharray: `${4 * largura} ${3 * largura}`,
                  }}
                />
              );
            })()}

            {selecionados.map((elemento) => (
              <rect
                key={`selecao-${elemento.id}`}
                x={elemento.x - 4 * largura}
                y={elemento.y - 4 * largura}
                width={elemento.largura + 8 * largura}
                height={elemento.altura + 8 * largura}
                style={{
                  fill: 'none',
                  stroke: corSelecao,
                  strokeWidth: 1.5 * largura,
                  strokeDasharray: `${5 * largura} ${3 * largura}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
            {unicoSelecionado !== null &&
              ALCAS.map((alca) => {
                const [ax, ay] = posicaoDaAlca(unicoSelecionado, alca);

                return (
                  <rect
                    key={`alca-${alca}`}
                    x={ax - (TAMANHO_ALCA / 2) * largura}
                    y={ay - (TAMANHO_ALCA / 2) * largura}
                    width={TAMANHO_ALCA * largura}
                    height={TAMANHO_ALCA * largura}
                    rx={2 * largura}
                    style={{ fill: theme.background.primary, stroke: corSelecao, strokeWidth: 1.5 * largura }}
                  />
                );
              })}
          </g>
        </svg>

        {elementos.length === 0 && previa === null && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing[1],
              pointerEvents: 'none',
              textAlign: 'center',
              padding: theme.spacing[4],
            }}
          >
            <Text size="md" weight="medium" color="secondary">
              Quadro vazio
            </Text>
            <Text size="sm" color="tertiary">
              Escolha uma ferramenta na barra de baixo e arraste no quadro, ou peça um desenho à IA.
            </Text>
          </div>
        )}

        {/* Camadas flutuantes por cima do canvas, como no canvas do Claude. */}
        <div style={{ position: 'absolute', top: 12, left: 16, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'auto' }}>
            <IndicadorSalvamento texto={textoDoIndicador(remoto.status)} erro={remoto.status === 'erro'} theme={theme} />
            {remoto.status === 'erro' && (
              <LightButton size="sm" onClick={remoto.tentarDeNovo}>
                Tentar de novo
              </LightButton>
            )}
          </div>
        </div>

        <div style={{ position: 'absolute', top: 10, right: 12, pointerEvents: 'none' }}>
          <ControlesTopoQuadro
            theme={theme}
            zoom={camera.zoom}
            aoMudarZoom={mudarZoomNoCentro}
            aoZoomCem={() => mudarZoomNoCentro(1 / camera.zoom)}
            aoAjustarATela={ajustarATela}
            podeDesfazer={historico.passado.length > 0}
            podeRefazer={historico.futuro.length > 0}
            aoDesfazer={() => mudarHistorico(desfazer)}
            aoRefazer={() => mudarHistorico(refazer)}
            temSelecao={selecao.size > 0}
            aoApagarSelecao={apagarSelecao}
          />
        </div>

        {(remoto.mudancaRemota || elementos.length > LIMITES_QUADRO.elementosAviso) && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(520px, calc(100% - 32px))',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {remoto.mudancaRemota && (
              <Callout
                status="info"
                title="Quadro atualizado"
                description="Outra pessoa ou a IA mudou este quadro. Recarregar descarta as suas alterações ainda não salvas."
                action={
                  <div style={{ display: 'flex', gap: theme.spacing[1], flexWrap: 'wrap' }}>
                    <LightButton size="sm" onClick={() => void remoto.recarregarDoServidor()}>
                      Recarregar
                    </LightButton>
                    <LightButton size="sm" onClick={remoto.manterMinhaVersao}>
                      Manter a minha versão
                    </LightButton>
                  </div>
                }
              />
            )}
            {elementos.length > LIMITES_QUADRO.elementosAviso && (
              <Callout
                status="warning"
                title="Quadro muito grande"
                description={`Este quadro tem ${elementos.length} elementos e pode ficar lento. Considere dividir em mais de um quadro.`}
              />
            )}
          </div>
        )}

        {iaAberta && recordId !== null && (
          <div style={{ position: 'absolute', top: 60, right: 12, bottom: 76, display: 'flex', pointerEvents: 'none' }}>
            <PainelIaQuadro
              theme={theme}
              quadroId={recordId}
              aoFechar={() => {
                setIaAberta(false);
                focarArea();
              }}
              aoIaTerminar={() => void remoto.recarregarDoServidor()}
            />
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 12px',
            pointerEvents: 'none',
          }}
        >
          <BarraFerramentasQuadro
            theme={theme}
            ferramenta={ferramenta}
            aoEscolherFerramenta={(nova) => {
              setFerramenta(nova);
              focarArea();
            }}
            cor={cor}
            aoEscolherCor={escolherCor}
            iaAberta={iaAberta}
            aoAlternarIa={() => setIaAberta((aberta) => !aberta)}
          />
        </div>

        <MenuContextoQuadro
          theme={theme}
          posicao={menu === null ? null : { x: menu.x, y: menu.y }}
          quantidadeSelecionada={selecao.size}
          podeEditarTexto={
            selecao.size === 1 &&
            historicoRef.current.presente.some((elemento) => selecao.has(elemento.id) && elemento.tipo !== 'traco')
          }
          podeColar={temCopiados}
          podeDesfazer={historico.passado.length > 0}
          aoFechar={() => setMenu(null)}
          aoEscolher={executarAcaoMenu}
          aoEscolherCor={(novaCor) => {
            setMenu(null);
            escolherCor(novaCor);
          }}
        />

        {renderizarEditorTexto()}
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.editor.frontComponent,
  name: 'quadro-editor',
  description: 'Quadro branco: desenhe caixas, notas, setas e traços livres, com zoom e salvamento automático.',
  component: QuadroEditor,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [OBJECTS.quadro.universalIdentifier],
  },
});
