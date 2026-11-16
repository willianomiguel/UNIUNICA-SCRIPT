import { type ReactNode, useRef } from 'react';
import { Dropdown } from 'integra-ui/components/navigation';
import {
  IconArrowBackUp,
  IconClick,
  IconCopy,
  IconFocusCentered,
  IconHash,
  IconNotes,
  IconPencil,
  IconSparkles,
  IconTrash,
  IconTypography,
} from 'integra-ui/icon';
import { type ThemeType } from 'integra-ui/theme';

import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';

export type AcaoMenuQuadro =
  | 'editarTexto'
  | 'duplicar'
  | 'copiar'
  | 'colar'
  | 'frente'
  | 'tras'
  | 'moldura'
  | 'apagar'
  | 'novaNota'
  | 'novoTexto'
  | 'novaMoldura'
  | 'selecionarTudo'
  | 'ajustar'
  | 'ia'
  | 'desfazer';

type MenuContextoQuadroProps = {
  theme: ThemeType;
  posicao: { x: number; y: number } | null;
  quantidadeSelecionada: number;
  podeEditarTexto: boolean;
  podeColar: boolean;
  podeDesfazer: boolean;
  aoFechar: () => void;
  aoEscolher: (acao: AcaoMenuQuadro) => void;
  aoEscolherCor: (cor: CorQuadro) => void;
};

const Bolinha = ({ cor, theme }: { cor: CorQuadro; theme: ThemeType }) => (
  <span
    style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: cor === 'gray' ? theme.color.gray9 : theme.color[`${cor}9`],
    }}
  />
);

// Menu do botão direito: com algo selecionado mostra ações do elemento; no vazio, ações do quadro.
export const MenuContextoQuadro = ({
  theme,
  posicao,
  quantidadeSelecionada,
  podeEditarTexto,
  podeColar,
  podeDesfazer,
  aoFechar,
  aoEscolher,
  aoEscolherCor,
}: MenuContextoQuadroProps) => {
  const ancoraRef = useRef<HTMLDivElement | null>(null);
  const noElemento = quantidadeSelecionada > 0;

  const item = (acao: AcaoMenuQuadro, rotulo: string, icone?: ReactNode, atalho?: string, cor?: 'danger') => (
    <Dropdown.ActionItem
      startIcon={icone}
      color={cor}
      description={atalho}
      descriptionPlacement="end"
      onClick={() => aoEscolher(acao)}
    >
      {rotulo}
    </Dropdown.ActionItem>
  );

  return (
    <>
      {/* Âncora invisível no ponto do clique: o Dropdown abre colado nela. */}
      <div
        ref={ancoraRef}
        style={{
          position: 'absolute',
          left: posicao?.x ?? 0,
          top: posicao?.y ?? 0,
          width: 1,
          height: 1,
          pointerEvents: 'none',
        }}
      />
      <Dropdown.Root
        type="menu"
        open={posicao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) {
            aoFechar();
          }
        }}
      >
        <Dropdown.Content
          aria-label={noElemento ? 'Ações do elemento' : 'Ações do quadro'}
          anchor={ancoraRef}
          side="bottom"
          align="start"
          width={240}
        >
          {noElemento ? (
            <>
              <Dropdown.Section>
                {podeEditarTexto && item('editarTexto', 'Editar texto', <IconPencil size={16} />, 'Enter')}
                {item('duplicar', 'Duplicar', <IconCopy size={16} />, 'Ctrl+D')}
                {item('copiar', 'Copiar', undefined, 'Ctrl+C')}
                {podeColar && item('colar', 'Colar', undefined, 'Ctrl+V')}
              </Dropdown.Section>
              <Dropdown.Separator />
              <Dropdown.Section>
                <Dropdown.Submenu type="menu">
                  <Dropdown.SubmenuTrigger>Cor</Dropdown.SubmenuTrigger>
                  <Dropdown.Content aria-label="Cor" width={180}>
                    <Dropdown.Section>
                      {CORES_QUADRO.map((opcao) => (
                        <Dropdown.ActionItem
                          key={opcao.valor}
                          startIcon={<Bolinha cor={opcao.valor} theme={theme} />}
                          onClick={() => aoEscolherCor(opcao.valor)}
                        >
                          {opcao.rotulo}
                        </Dropdown.ActionItem>
                      ))}
                    </Dropdown.Section>
                  </Dropdown.Content>
                </Dropdown.Submenu>
                {item('frente', 'Trazer para a frente', undefined, ']')}
                {item('tras', 'Enviar para trás', undefined, '[')}
                {item('moldura', 'Agrupar em moldura', <IconHash size={16} />, 'Ctrl+G')}
              </Dropdown.Section>
              <Dropdown.Separator />
              <Dropdown.Section>
                {item(
                  'apagar',
                  quantidadeSelecionada > 1 ? `Apagar ${quantidadeSelecionada} itens` : 'Apagar',
                  <IconTrash size={16} />,
                  'Delete',
                  'danger',
                )}
              </Dropdown.Section>
            </>
          ) : (
            <>
              <Dropdown.Section>
                {podeColar && item('colar', 'Colar aqui', <IconCopy size={16} />, 'Ctrl+V')}
                {item('novaNota', 'Nota adesiva aqui', <IconNotes size={16} />)}
                {item('novoTexto', 'Texto aqui', <IconTypography size={16} />)}
                {item('novaMoldura', 'Moldura aqui', <IconHash size={16} />)}
              </Dropdown.Section>
              <Dropdown.Separator />
              <Dropdown.Section>
                {item('selecionarTudo', 'Selecionar tudo', <IconClick size={16} />, 'Ctrl+A')}
                {item('ajustar', 'Ajustar à tela', <IconFocusCentered size={16} />)}
                {podeDesfazer && item('desfazer', 'Desfazer', <IconArrowBackUp size={16} />, 'Ctrl+Z')}
                {item('ia', 'Pedir à IA', <IconSparkles size={16} />)}
              </Dropdown.Section>
            </>
          )}
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
};
