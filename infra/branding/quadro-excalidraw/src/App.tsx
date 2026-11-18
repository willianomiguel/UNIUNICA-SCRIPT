import {
  CaptureUpdateAction,
  Excalidraw,
  getCommonBounds,
  hashElementsVersion,
  reconcileElements,
  restoreElements,
} from '@excalidraw/excalidraw';
import type { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type CenaGravada, ErroApi, gravarCena, gravarCenaAoSair, lerQuadro } from './api';
import { criarMedidor, fontesDosTextosMarcados, medirTextosMarcados } from './medir-textos';
import { type Parametros, lerParametros } from './parametros';

const ESPERA_SALVAR_MS = 500;
const INTERVALO_CHECAGEM_MS = 4000;
// Apagados recentes ficam gravados para a mescla com outra aba ou com a IA não ressuscitar o que sumiu.
const GUARDAR_APAGADOS_MS = 24 * 60 * 60 * 1000;

type Status = 'salvo' | 'pendente' | 'salvando' | 'erro' | 'sessao';

type Carga = { tipo: 'carregando' } | { tipo: 'erro'; mensagem: string } | { tipo: 'pronto'; dados: ExcalidrawInitialDataState };

const TEXTO_STATUS: Record<Status, string> = {
  salvo: 'Salvo',
  // Pendente mostra o mesmo que salvando: "Alterações não salvas" piscava a cada traço.
  pendente: 'Salvando…',
  salvando: 'Salvando…',
  erro: 'Erro ao salvar — tentando de novo',
  sessao: 'Sessão expirada — recarregue a página (o que não foi salvo se perde)',
};

const versaoVisivel = (elementos: readonly OrderedExcalidrawElement[]) =>
  hashElementsVersion(elementos.filter((elemento) => !elemento.isDeleted));

const medir = criarMedidor();

const ajustarTextosMarcados = async (api: ExcalidrawImperativeAPI) => {
  const fontes = fontesDosTextosMarcados(api.getSceneElementsIncludingDeleted());

  if (fontes.length === 0) {
    return;
  }

  // O Excalidraw registra as fontes só depois de desenhar; antes disso load() resolve vazio e a medida sairia
  // com uma fonte reserva mais estreita. Sem a fonte, a marca fica e a medida acontece na próxima abertura.
  for (let tentativa = 0; ; tentativa += 1) {
    const faces = await Promise.all(fontes.map((fonte) => document.fonts.load(fonte).catch(() => [])));

    if (faces.every((encontradas) => encontradas.length > 0)) {
      break;
    }

    if (tentativa === 20) {
      return;
    }

    await new Promise((resolver) => setTimeout(resolver, 300));
  }

  const medidos = medirTextosMarcados(api.getSceneElementsIncludingDeleted(), medir);

  if (medidos) {
    api.updateScene({ elements: medidos, captureUpdate: CaptureUpdateAction.NEVER });
  }
};

// Abre a 100% centralizado; só afasta o zoom quando o desenho não cabe na tela.
const enquadrar = (api: ExcalidrawImperativeAPI) => {
  const visiveis = api.getSceneElements();

  if (visiveis.length === 0) {
    return;
  }

  const [minX, minY, maxX, maxY] = getCommonBounds(visiveis);
  const { width, height } = api.getAppState();

  if (maxX - minX > width * 0.9 || maxY - minY > height * 0.8) {
    api.scrollToContent(visiveis, { fitToViewport: true, viewportZoomFactor: 0.85 });
  }
};

const montarCena = (api: ExcalidrawImperativeAPI): CenaGravada => {
  const agora = Date.now();
  const elementos = api
    .getSceneElementsIncludingDeleted()
    .filter((elemento) => !elemento.isDeleted || agora - elemento.updated < GUARDAR_APAGADOS_MS);
  const usados = new Set<string>(
    elementos.flatMap((elemento) => (elemento.type === 'image' && !elemento.isDeleted && elemento.fileId ? [elemento.fileId] : [])),
  );
  const todos = api.getFiles();
  const appState = api.getAppState();

  return {
    tipo: 'excalidraw',
    versao: 1,
    elements: elementos,
    appState: { viewBackgroundColor: appState.viewBackgroundColor, gridModeEnabled: appState.gridModeEnabled },
    files: Object.fromEntries(Object.entries(todos).filter(([id]) => usados.has(id))),
  };
};

export const App = () => {
  const parametrosRef = useRef<Parametros | null>(lerParametros());
  const [tema, setTema] = useState(parametrosRef.current?.tema ?? 'light');
  const [carga, setCarga] = useState<Carga>({ tipo: 'carregando' });
  const [status, setStatus] = useState<Status>('salvo');
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const gravadoRef = useRef<number | null>(null);
  const updatedAtRef = useRef<string | null>(null);
  const salvandoRef = useRef(false);
  const pendenteRef = useRef(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<Status>('salvo');

  statusRef.current = status;

  useEffect(() => {
    const aoMudarHash = () => {
      const novos = lerParametros();

      if (novos) {
        parametrosRef.current = novos;
        setTema(novos.tema);
      }
    };

    window.addEventListener('hashchange', aoMudarHash);

    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  useEffect(() => {
    const parametros = parametrosRef.current;

    if (!parametros) {
      setCarga({ tipo: 'erro', mensagem: 'Endereço do quadro inválido.' });

      return;
    }

    lerQuadro(parametros)
      .then((quadro) => {
        updatedAtRef.current = quadro.updatedAt;
        const elementos = restoreElements((quadro.cena?.elements ?? []) as OrderedExcalidrawElement[], null, {
          refreshDimensions: true,
          repairBindings: true,
        });

        gravadoRef.current = versaoVisivel(elementos);
        setCarga({
          tipo: 'pronto',
          dados: {
            elements: elementos,
            appState: { ...(quadro.cena?.appState ?? {}), theme: parametros.tema },
            files: (quadro.cena?.files ?? {}) as BinaryFiles,
            scrollToContent: true,
          },
        });
      })
      .catch((erro: unknown) =>
        setCarga({
          tipo: 'erro',
          mensagem:
            erro instanceof ErroApi && erro.status === 404
              ? 'Quadro não encontrado.'
              : erro instanceof ErroApi && (erro.status === 401 || erro.status === 403)
                ? 'Sem permissão para abrir este quadro.'
                : 'Não foi possível abrir o quadro. Recarregue a página.',
        }),
      );
  }, []);

  const salvar = useCallback(async () => {
    const api = apiRef.current;
    const parametros = parametrosRef.current;

    if (!api || !parametros || salvandoRef.current) {
      return;
    }

    salvandoRef.current = true;
    pendenteRef.current = false;
    setStatus('salvando');
    const cena = montarCena(api);
    const versao = versaoVisivel(api.getSceneElementsIncludingDeleted());

    try {
      const quadro = await gravarCena(parametros, cena);

      updatedAtRef.current = quadro.updatedAt;
      gravadoRef.current = versao;
      setStatus(pendenteRef.current ? 'pendente' : 'salvo');
    } catch (erro) {
      pendenteRef.current = true;
      setStatus(erro instanceof ErroApi && erro.status === 401 ? 'sessao' : 'erro');
    } finally {
      salvandoRef.current = false;
    }

    if (pendenteRef.current) {
      agendarSalvar(ESPERA_SALVAR_MS * 3);
    }
  }, []);

  const agendarSalvar = (espera: number) => {
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
    }

    temporizadorRef.current = setTimeout(() => void salvar(), espera);
  };

  const aoMudar = (elementos: readonly OrderedExcalidrawElement[]) => {
    if (gravadoRef.current === null || versaoVisivel(elementos) === gravadoRef.current) {
      return;
    }

    pendenteRef.current = true;
    setStatus((atual) => (atual === 'sessao' ? atual : 'pendente'));
    agendarSalvar(ESPERA_SALVAR_MS);
  };

  // Traz o que a IA (ou outra aba) gravou, mesclando elemento a elemento pela versão.
  useEffect(() => {
    if (carga.tipo !== 'pronto') {
      return;
    }

    const intervalo = setInterval(async () => {
      const api = apiRef.current;
      const parametros = parametrosRef.current;

      if (!api || !parametros || salvandoRef.current || pendenteRef.current || document.hidden) {
        return;
      }

      try {
        const quadro = await lerQuadro(parametros);

        if (quadro.updatedAt === updatedAtRef.current || salvandoRef.current || pendenteRef.current) {
          return;
        }

        updatedAtRef.current = quadro.updatedAt;
        const locais = api.getSceneElementsIncludingDeleted();
        const remotos = restoreElements((quadro.cena?.elements ?? []) as OrderedExcalidrawElement[], locais, {
          refreshDimensions: true,
          repairBindings: true,
        });
        const mesclados = reconcileElements(locais, remotos as never, api.getAppState() as AppState);
        const arquivos = Object.values(quadro.cena?.files ?? {}) as BinaryFiles[string][];

        if (arquivos.length > 0) {
          api.addFiles(arquivos);
        }

        gravadoRef.current = versaoVisivel(remotos);
        api.updateScene({ elements: mesclados, captureUpdate: CaptureUpdateAction.NEVER });
        void ajustarTextosMarcados(api);
      } catch {
        // Falha de leitura na checagem não atrapalha a edição; tenta de novo no próximo ciclo.
      }
    }, INTERVALO_CHECAGEM_MS);

    return () => clearInterval(intervalo);
  }, [carga.tipo]);

  // Trocar de aba ou de registro no IntegraCore só remove o iframe (não há beforeunload): grava na hora.
  useEffect(() => {
    const gravarJa = () => {
      const api = apiRef.current;
      const parametros = parametrosRef.current;

      if (api && parametros && pendenteRef.current && statusRef.current !== 'sessao') {
        gravarCenaAoSair(parametros, montarCena(api));
      }
    };
    const aoOcultar = () => document.visibilityState === 'hidden' && gravarJa();
    const avisarAoSair = (evento: BeforeUnloadEvent) => {
      if ((pendenteRef.current || salvandoRef.current) && statusRef.current !== 'sessao') {
        evento.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', aoOcultar);
    window.addEventListener('pagehide', gravarJa);
    window.addEventListener('beforeunload', avisarAoSair);

    return () => {
      document.removeEventListener('visibilitychange', aoOcultar);
      window.removeEventListener('pagehide', gravarJa);
      window.removeEventListener('beforeunload', avisarAoSair);
    };
  }, []);

  if (carga.tipo !== 'pronto') {
    return (
      <div className={`quadro-mensagem ${tema}`} role={carga.tipo === 'erro' ? 'alert' : 'status'}>
        {carga.tipo === 'erro' ? carga.mensagem : 'Abrindo o quadro…'}
      </div>
    );
  }

  return (
    <Excalidraw
      excalidrawAPI={(api) => {
        apiRef.current = api;
        setTimeout(() => {
          enquadrar(api);
          void ajustarTextosMarcados(api);
        }, 0);
      }}
      initialData={carga.dados}
      theme={tema}
      langCode="pt-BR"
      onChange={aoMudar}
      UIOptions={{
        canvasActions: { loadScene: false, saveToActiveFile: false, toggleTheme: null, export: false },
      }}
      renderTopRightUI={() => (
        // Só erro e sessão expirada são anunciados; "Salvando…/Salvo" a cada traço seria ruído no leitor de tela.
        <div
          className={`quadro-status quadro-status-${status}`}
          role={status === 'erro' || status === 'sessao' ? 'alert' : undefined}
        >
          {TEXTO_STATUS[status]}
        </div>
      )}
    />
  );
};
