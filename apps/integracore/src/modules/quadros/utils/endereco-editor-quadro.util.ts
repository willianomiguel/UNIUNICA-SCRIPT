// Página do Excalidraw servida pela imagem IntegraCore (infra/branding/quadro-excalidraw). Tudo vai no #hash:
// não chega ao servidor nem ao Referer, e trocar só o hash (token novo, tema) não recarrega o iframe.
export const enderecoEditorQuadro = ({
  apiUrl,
  quadroId,
  token,
  tema,
}: {
  apiUrl: string;
  quadroId: string;
  token: string;
  tema: 'light' | 'dark';
}): string => {
  const base = apiUrl.replace(/\/+$/, '');
  const hash = new URLSearchParams({ id: quadroId, t: token, tema });

  return `${base}/quadro-excalidraw/editor.htm#${hash.toString()}`;
};
