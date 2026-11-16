import { useEffect, useRef, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';
import { LightButton, LightIconButton } from 'integra-ui/components/input';
import { IconSend, IconSparkles, IconX } from 'integra-ui/icon';
import { Loader } from 'integra-ui/primitives/feedback';
import { Textarea } from 'integra-ui/primitives/input';
import { Text } from 'integra-ui/primitives/typography';
import { type ThemeType } from 'integra-ui/theme';

import { QUADRO_IA_ROTA } from 'src/modules/quadros/constants/quadro-ia-rota.constant';
import { type MensagemIaQuadro } from 'src/modules/quadros/types/mensagem-ia-quadro';

const SUGESTOES = [
  'Desenhe o fluxo de venda: lead, proposta, pagamento, entrega',
  'Organize as notas deste quadro em uma moldura por tema',
  'Faça um quadro "etapa por etapa" com passo a passo, regras e pronto quando',
];

type PainelIaQuadroProps = {
  theme: ThemeType;
  quadroId: string;
  aoFechar: () => void;
  aoIaTerminar: () => void;
};

// Conversa com a IA do IntegraCore; a IA desenha pelas ferramentas do quadro e o editor recarrega depois.
export const PainelIaQuadro = ({ theme, quadroId, aoFechar, aoIaTerminar }: PainelIaQuadroProps) => {
  const [mensagens, setMensagens] = useState<MensagemIaQuadro[]>([]);
  const [rascunho, setRascunho] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // O sandbox não deixa limpar o campo pelo value: recriar o campo (key) zera o texto.
  const [versaoCampo, setVersaoCampo] = useState(0);
  const campoRef = useRef<HTMLTextAreaElement | null>(null);
  const enterSemShiftRef = useRef(false);

  useEffect(() => {
    const temporizador = setTimeout(() => campoRef.current?.focus(), 30);

    return () => clearTimeout(temporizador);
  }, [versaoCampo]);

  const enviar = async (texto: string) => {
    const mensagem = texto.trim();

    if (mensagem === '' || enviando) {
      return;
    }

    const historico = mensagens;

    setMensagens([...historico, { papel: 'usuario', texto: mensagem }]);
    setRascunho('');
    setVersaoCampo((versao) => versao + 1);
    setErro(null);
    setEnviando(true);
    try {
      const resposta = await new RestApiClient().post<{ ok?: boolean; resposta?: string; erro?: string }>(
        `/s${QUADRO_IA_ROTA}`,
        { quadroId, mensagem, historico },
      );

      if (resposta?.ok === true && typeof resposta.resposta === 'string') {
        setMensagens((atuais) => [...atuais, { papel: 'ia', texto: resposta.resposta as string }]);
        aoIaTerminar();
      } else {
        setErro(resposta?.erro ?? 'A IA não respondeu.');
      }
    } catch {
      setErro('Não foi possível falar com a IA agora. Verifique a conexão e tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      aria-label="Conversa com a IA"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 340,
        maxWidth: 'calc(100% - 32px)',
        maxHeight: '100%',
        background: theme.background.primary,
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: 14,
        boxShadow: theme.boxShadow.strong,
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 8px 8px 14px',
          borderBottom: `1px solid ${theme.border.color.light}`,
        }}
      >
        <IconSparkles size={16} />
        <Text size="sm" weight="semibold">
          Pedir à IA
        </Text>
        <div style={{ marginLeft: 'auto' }}>
          <LightIconButton aria-label="Fechar conversa" tooltip="Fechar" onClick={aoFechar}>
            <IconX size={16} />
          </LightIconButton>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 120, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mensagens.length === 0 && (
          <>
            <Text size="sm" color="secondary">
              Diga o que desenhar ou organizar. A IA lê o quadro e desenha aqui.
            </Text>
            {SUGESTOES.map((sugestao) => (
              <LightButton key={sugestao} size="sm" onClick={() => void enviar(sugestao)} style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '6px 10px' }}>
                {sugestao}
              </LightButton>
            ))}
          </>
        )}
        {mensagens.map((mensagem, indice) => (
          <div
            key={indice}
            style={{
              alignSelf: mensagem.papel === 'usuario' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              padding: '8px 12px',
              borderRadius: 12,
              background: mensagem.papel === 'usuario' ? theme.background.transparent.medium : theme.background.secondary,
              whiteSpace: 'pre-wrap',
            }}
          >
            <Text size="sm">{mensagem.texto}</Text>
          </div>
        ))}
        {enviando && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Loader />
            <Text size="sm" color="tertiary">
              A IA está desenhando…
            </Text>
          </div>
        )}
        {erro !== null && (
          <Text size="sm" style={{ color: theme.font.color.danger }}>
            {erro}
          </Text>
        )}
      </div>

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          void enviar(rascunho);
        }}
        style={{ display: 'flex', gap: 6, alignItems: 'flex-end', padding: 10, borderTop: `1px solid ${theme.border.color.light}` }}
      >
        <div style={{ flex: 1, minHeight: 36, display: 'flex', alignItems: 'center' }}>
          {/* Enquanto envia o campo sai da tela: só assim o sandbox descarta o texto (e o Enter) já digitados. */}
          {enviando ? (
            <Text size="sm" color="tertiary">
              Enviando…
            </Text>
          ) : (
          <Textarea
            key={versaoCampo}
            ref={campoRef}
            aria-label="Mensagem para a IA"
            autoResize
            maxRows={6}
            value={rascunho}
            placeholder="Peça um desenho… (Enter envia)"
            // O Enter chega do sandbox depois que a quebra de linha já entrou no texto: envia no próprio onValueChange.
            onValueChange={(valor) => {
              if (enterSemShiftRef.current && valor.endsWith('\n')) {
                enterSemShiftRef.current = false;
                void enviar(valor);

                return;
              }
              setRascunho(valor);
            }}
            onKeyDown={(evento) => {
              evento.stopPropagation();
              enterSemShiftRef.current = evento.key === 'Enter' && !evento.shiftKey;
            }}
          />
          )}
        </div>
        <LightIconButton aria-label="Enviar" tooltip="Enviar" disabled={enviando || rascunho.trim() === ''} type="submit">
          <IconSend size={16} />
        </LightIconButton>
      </form>
    </section>
  );
};
