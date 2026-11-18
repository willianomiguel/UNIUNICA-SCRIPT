import '@excalidraw/excalidraw/index.css';
import './estilo.css';

import { createRoot } from 'react-dom/client';

import { App } from './App';

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH?: string;
  }
}

// Origem isolada: location.origin é "null", então a pasta das fontes sai do endereço da página.
window.EXCALIDRAW_ASSET_PATH = new URL('./', location.href).href;

const raiz = document.getElementById('raiz');

// Só roda dentro do iframe isolado do IntegraCore. Aberta direto numa aba, a página teria a origem do sistema
// (e a sessão do usuário) ao alcance de qualquer falha do editor.
if (raiz && self.origin !== 'null') {
  raiz.textContent = 'Abra o quadro pelo IntegraCore.';
} else if (raiz) {
  createRoot(raiz).render(<App />);
}
