import { type ReactNode } from 'react';
import { LightButton, LightIconButton } from 'integra-ui/components/input';
import { Dropdown } from 'integra-ui/components/navigation';
import {
  IconArrowBackUp,
  IconArrowRight,
  IconChevronDown,
  IconCircle,
  IconClick,
  IconFocusCentered,
  IconHandMove,
  IconHash,
  IconMinus,
  IconNotes,
  IconPencil,
  IconPlus,
  IconSparkles,
  IconSquare,
  IconTrash,
  IconTypography,
} from 'integra-ui/icon';
import { Text } from 'integra-ui/primitives/typography';
import { type ThemeType } from 'integra-ui/theme';

import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type FerramentaQuadro } from 'src/modules/quadros/types/ferramenta-quadro';

const FERRAMENTAS: { valor: FerramentaQuadro; rotulo: string; atalho: string; icone: ReactNode }[] = [
  { valor: 'selecionar', rotulo: 'Selecionar', atalho: 'V', icone: <IconClick size={18} /> },
  { valor: 'mao', rotulo: 'Mover a tela', atalho: 'H', icone: <IconHandMove size={18} /> },
  { valor: 'texto', rotulo: 'Texto', atalho: 'T', icone: <IconTypography size={18} /> },
  { valor: 'moldura', rotulo: 'Moldura', atalho: 'F', icone: <IconHash size={18} /> },
  { valor: 'nota', rotulo: 'Nota adesiva', atalho: 'N', icone: <IconNotes size={18} /> },
  { valor: 'traco', rotulo: 'Caneta', atalho: 'P', icone: <IconPencil size={18} /> },
  { valor: 'retangulo', rotulo: 'Retângulo', atalho: 'R', icone: <IconSquare size={18} /> },
  { valor: 'elipse', rotulo: 'Elipse', atalho: 'O', icone: <IconCircle size={18} /> },
  { valor: 'seta', rotulo: 'Seta', atalho: 'A', icone: <IconArrowRight size={18} /> },
];

export const ATALHOS_FERRAMENTAS: Record<string, FerramentaQuadro> = Object.fromEntries(
  FERRAMENTAS.map((ferramenta) => [ferramenta.atalho.toLowerCase(), ferramenta.valor]),
);

const estiloPilula = (theme: ThemeType) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: 4,
  borderRadius: 14,
  background: theme.background.tertiary,
  border: `1px solid ${theme.border.color.strong}`,
  boxShadow: theme.boxShadow.strong,
  pointerEvents: 'auto' as const,
});

const Separador = ({ theme }: { theme: ThemeType }) => (
  <div style={{ width: 1, height: 22, margin: '0 4px', background: theme.border.color.medium }} />
);

const Bolinha = ({ cor, theme, tamanho = 12 }: { cor: CorQuadro; theme: ThemeType; tamanho?: number }) => (
  <span
    style={{
      display: 'inline-block',
      width: tamanho,
      height: tamanho,
      borderRadius: '50%',
      background: cor === 'gray' ? theme.color.gray9 : theme.color[`${cor}9`],
      boxShadow: `0 0 0 2px ${theme.background.primary}, 0 0 0 3px ${theme.border.color.strong}`,
    }}
  />
);

type BarraFerramentasQuadroProps = {
  theme: ThemeType;
  ferramenta: FerramentaQuadro;
  aoEscolherFerramenta: (ferramenta: FerramentaQuadro) => void;
  cor: CorQuadro;
  aoEscolherCor: (cor: CorQuadro) => void;
  iaAberta: boolean;
  aoAlternarIa: () => void;
};

// Barra flutuante embaixo, no estilo dos canvas (Claude, Figma).
export const BarraFerramentasQuadro = ({
  theme,
  ferramenta,
  aoEscolherFerramenta,
  cor,
  aoEscolherCor,
  iaAberta,
  aoAlternarIa,
}: BarraFerramentasQuadroProps) => {
  const rotuloCor = CORES_QUADRO.find((opcao) => opcao.valor === cor)?.rotulo ?? cor;

  return (
    <div role="toolbar" aria-label="Ferramentas do quadro" style={estiloPilula(theme)}>
      {FERRAMENTAS.map((opcao) => {
        const ativa = opcao.valor === ferramenta;

        return (
          <div
            key={opcao.valor}
            style={{
              borderRadius: 10,
              background: ativa ? theme.background.transparent.medium : 'transparent',
            }}
          >
            <LightIconButton
              aria-label={`${opcao.rotulo} (${opcao.atalho})`}
              aria-pressed={ativa}
              tooltip={`${opcao.rotulo} (${opcao.atalho})`}
              tooltipPlace="top"
              emphasis={ativa ? 'standard' : 'subtle'}
              onClick={() => aoEscolherFerramenta(opcao.valor)}
            >
              {opcao.icone}
            </LightIconButton>
          </div>
        );
      })}

      <Separador theme={theme} />

      <Dropdown.Root type="menu">
        <Dropdown.Trigger
          render={
            <LightIconButton aria-label={`Cor: ${rotuloCor}`} tooltip={`Cor: ${rotuloCor}`} tooltipPlace="top">
              <Bolinha cor={cor} theme={theme} tamanho={14} />
            </LightIconButton>
          }
        />
        <Dropdown.Content aria-label="Escolher cor" width={180}>
          <Dropdown.Section>
            {CORES_QUADRO.map((opcao) => (
              <Dropdown.OptionItem
                key={opcao.valor}
                value={opcao.valor}
                selected={opcao.valor === cor}
                startIcon={<Bolinha cor={opcao.valor} theme={theme} />}
                onSelect={() => aoEscolherCor(opcao.valor)}
              >
                {opcao.rotulo}
              </Dropdown.OptionItem>
            ))}
          </Dropdown.Section>
        </Dropdown.Content>
      </Dropdown.Root>

      <Separador theme={theme} />

      <div style={{ borderRadius: 10, background: iaAberta ? theme.background.transparent.medium : 'transparent' }}>
        <LightButton size="sm" startIcon={<IconSparkles size={16} />} onClick={aoAlternarIa} aria-pressed={iaAberta}>
          Pedir à IA
        </LightButton>
      </div>
    </div>
  );
};

type ControlesTopoQuadroProps = {
  theme: ThemeType;
  zoom: number;
  aoMudarZoom: (fator: number) => void;
  aoZoomCem: () => void;
  aoAjustarATela: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
  temSelecao: boolean;
  aoApagarSelecao: () => void;
};

// Pílula do canto superior direito: desfazer/refazer, apagar e zoom com menu.
export const ControlesTopoQuadro = ({
  theme,
  zoom,
  aoMudarZoom,
  aoZoomCem,
  aoAjustarATela,
  podeDesfazer,
  podeRefazer,
  aoDesfazer,
  aoRefazer,
  temSelecao,
  aoApagarSelecao,
}: ControlesTopoQuadroProps) => (
  <div style={estiloPilula(theme)}>
    <LightIconButton aria-label="Desfazer (Ctrl+Z)" tooltip="Desfazer (Ctrl+Z)" disabled={!podeDesfazer} onClick={aoDesfazer}>
      <IconArrowBackUp size={16} />
    </LightIconButton>
    <LightIconButton
      aria-label="Refazer (Ctrl+Shift+Z)"
      tooltip="Refazer (Ctrl+Shift+Z)"
      disabled={!podeRefazer}
      onClick={aoRefazer}
    >
      <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
        <IconArrowBackUp size={16} />
      </span>
    </LightIconButton>
    <LightIconButton
      aria-label="Apagar selecionados (Delete)"
      tooltip="Apagar selecionados (Delete)"
      disabled={!temSelecao}
      onClick={aoApagarSelecao}
    >
      <IconTrash size={16} />
    </LightIconButton>
    <Separador theme={theme} />
    <Dropdown.Root type="menu">
      <Dropdown.Trigger
        render={
          <LightButton size="sm" endIcon={<IconChevronDown size={14} />} aria-label={`Zoom ${Math.round(zoom * 100)}%`}>
            {Math.round(zoom * 100)}%
          </LightButton>
        }
      />
      <Dropdown.Content aria-label="Zoom" width={200}>
        <Dropdown.Section>
          <Dropdown.ActionItem startIcon={<IconPlus size={16} />} closeOnClick={false} onClick={() => aoMudarZoom(1.2)}>
            Aumentar zoom
          </Dropdown.ActionItem>
          <Dropdown.ActionItem startIcon={<IconMinus size={16} />} closeOnClick={false} onClick={() => aoMudarZoom(1 / 1.2)}>
            Diminuir zoom
          </Dropdown.ActionItem>
          <Dropdown.ActionItem onClick={aoZoomCem}>Zoom 100%</Dropdown.ActionItem>
          <Dropdown.ActionItem startIcon={<IconFocusCentered size={16} />} onClick={aoAjustarATela}>
            Ajustar à tela
          </Dropdown.ActionItem>
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown.Root>
  </div>
);

export const IndicadorSalvamento = ({ texto, erro, theme }: { texto: string; erro: boolean; theme: ThemeType }) => (
  <Text size="xs" color="tertiary" aria-live="polite" style={erro ? { color: theme.font.color.danger } : undefined}>
    {texto}
  </Text>
);
