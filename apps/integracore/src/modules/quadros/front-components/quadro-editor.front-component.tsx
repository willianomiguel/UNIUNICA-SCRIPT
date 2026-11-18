import { useState } from 'react';
import { defineFrontComponent, PageLayoutType } from 'integra-sdk/define';
import { useRecordId } from 'integra-sdk/front-component';
import { Callout } from 'integra-ui/components/feedback';
import { LightButton, LightIconButton } from 'integra-ui/components/input';
import { IconMaximize, IconMinimize, IconSparkles } from 'integra-ui/icon';
import { Loader } from 'integra-ui/primitives/feedback';
import { type ThemeType, useTheme } from 'integra-ui/theme';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { PainelIaQuadro } from 'src/modules/quadros/front-components/components/PainelIaQuadro';
import { useEsquemaDeCores } from 'src/modules/quadros/front-components/hooks/use-esquema-de-cores';
import { usePrepararQuadro } from 'src/modules/quadros/front-components/hooks/use-preparar-quadro';
import { lerApiUrl, useTokenDoUsuario } from 'src/modules/quadros/front-components/hooks/use-token-do-usuario';
import { enderecoEditorQuadro } from 'src/modules/quadros/utils/endereco-editor-quadro.util';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const estiloPilula = (theme: ThemeType) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: 4,
  borderRadius: 12,
  background: theme.background.primary,
  border: `1px solid ${theme.border.color.medium}`,
  boxShadow: theme.boxShadow.light,
  pointerEvents: 'auto' as const,
});

const Centro = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
    {children}
  </div>
);

// O desenho em si é o Excalidraw, numa página própria aberta em iframe: o worker do front component não tem
// canvas. Esta casca só prepara o quadro, passa id/tema/token e mantém o "Pedir à IA" e o modo foco.
const QuadroEditor = () => {
  const theme = useTheme();
  const esquema = useEsquemaDeCores();
  const recordId = useRecordId();
  const preparo = usePrepararQuadro(recordId);
  const token = useTokenDoUsuario();
  const apiUrl = lerApiUrl();
  const [iaAberta, setIaAberta] = useState(false);
  const [emFoco, setEmFoco] = useState(false);

  if (preparo.tipo === 'carregando') {
    return (
      <Centro>
        <Loader />
      </Centro>
    );
  }

  if (preparo.tipo === 'erro' || recordId === null || token === null || apiUrl === null) {
    return (
      <Centro>
        <Callout
          status="error"
          title="Não foi possível abrir o quadro"
          description={preparo.tipo === 'erro' ? preparo.mensagem : 'Sessão sem acesso à API. Recarregue a página.'}
        />
      </Centro>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 420,
        overflow: 'hidden',
        background: theme.background.primary,
        ...(emFoco ? { position: 'fixed' as const, inset: 0, zIndex: 30, height: 'auto' } : {}),
      }}
    >
      <iframe
        title="Editor do quadro"
        src={enderecoEditorQuadro({ apiUrl, quadroId: recordId, token, tema: esquema })}
        sandbox="allow-scripts allow-forms allow-popups allow-downloads"
        allow="clipboard-read; clipboard-write"
        width="100%"
        height="100%"
        style={{ display: 'block', border: 0, width: '100%', height: '100%' }}
      />

      {/* Fica acima da barra de baixo do Excalidraw, à direita, longe do zoom e do desfazer. */}
      <div style={{ position: 'absolute', right: 64, bottom: 16, pointerEvents: 'none' }}>
        <div style={estiloPilula(theme)}>
          <LightButton
            size="sm"
            startIcon={<IconSparkles size={16} />}
            aria-expanded={iaAberta}
            onClick={() => setIaAberta((aberta) => !aberta)}
          >
            Pedir à IA
          </LightButton>
          {/* O data-testid avisa o index.html da imagem para pôr/tirar o navegador da tela cheia (aplicar-marca.js). */}
          <div data-testid={emFoco ? 'quadro-sair-foco' : 'quadro-entrar-foco'} style={{ display: 'flex' }}>
            <LightIconButton
              aria-label={emFoco ? 'Sair do modo foco' : 'Modo foco: quadro em tela cheia'}
              tooltip={emFoco ? 'Sair do modo foco' : 'Modo foco (tela cheia)'}
              onClick={() => setEmFoco((ativo) => !ativo)}
            >
              {emFoco ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
            </LightIconButton>
          </div>
        </div>
      </div>

      {iaAberta && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            right: 12,
            bottom: 72,
            maxWidth: 'calc(100% - 24px)',
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          <PainelIaQuadro
            theme={theme}
            quadroId={recordId}
            aoFechar={() => setIaAberta(false)}
            // O editor busca o desenho novo sozinho em até 4 s.
            aoIaTerminar={() => undefined}
          />
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.editor.frontComponent,
  name: 'quadro-editor',
  description: 'Quadro branco com o Excalidraw: formas, setas, texto, desenho livre e imagens, com salvamento automático.',
  component: QuadroEditor,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [OBJECTS.quadro.universalIdentifier],
  },
});
