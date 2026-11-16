// Aplica a marca IntegraCore no build: título, textos da interface, traduções, e-mails e tema.
// Roda no build da imagem (ver Dockerfile). Falha o build se não achar o que trocar,
// para uma versão nova do motor não passar despercebida.
const fs = require('fs');
const path = require('path');

const MARCA = 'IntegraCore';
const front = process.argv[2];
const server = path.resolve(front, '../..'); // /app/packages/<pacote>/dist/front -> /app/packages/<pacote>
const assets = path.join(front, 'assets');

const trocar = (arquivo, transformar) => {
  const antes = fs.readFileSync(arquivo, 'utf8');
  const depois = transformar(antes);
  if (antes === depois) throw new Error(`Nada trocado em ${arquivo}`);
  fs.writeFileSync(arquivo, depois);
  console.log(`marca aplicada: ${path.relative(front, arquivo)}`);
};

const trocarTudo = (arquivo) =>
  trocar(arquivo, (s) =>
    s
      .replace(/\bdocs\.twenty\.com\b/g, 'docs.integracore.com')
      .replace(/\btwenty\.com\b/g, 'integracore.com')
      .replace(/\btwentyhq\b/g, 'integracorehq')
      .replace(/\bTwenty\b/g, MARCA),
  );

// Pequenos ajustes de interface: tira os cards de vídeo (iframe do Vimeo) das telas de configuração,
// esconde telas que não usamos (e manda a rota para outra) e corrige textos que vêm de dados ou de
// exemplos (ex.: "por Twenty", "npx twenty@latest"). Roda como observador para pegar telas montadas depois.
const TELAS_ESCONDIDAS = {
  '/settings/community': '/settings/profile',
  '/settings/applications': '/settings/developers',
};

const scriptUi = `
<script id="marca-ui">
(function(){
  var MARCA='${MARCA}';
  var ESCONDER=${JSON.stringify(TELAS_ESCONDIDAS)};

  function redirecionar(){
    var atual=location.pathname.replace(/\\/$/,'');
    for(var chave in ESCONDER){
      if(atual===chave||atual.indexOf(chave+'/')===0){location.replace(ESCONDER[chave]);return true;}
    }
    if(atual==='/settings/admin-panel'&&(location.hash===''||location.hash==='#apps')){location.replace('/settings/admin-panel#general');return true;}
    return false;
  }

  function textos(raiz){
    var w=document.createTreeWalker(raiz,4,null),n;
    while((n=w.nextNode())){
      var v=n.nodeValue;
      if(!v||(v.indexOf('Twenty')<0&&v.indexOf('twenty')<0))continue;
      n.nodeValue=v.replace(/npx twenty@latest/g,'yarn integra').replace(/\\bTwenty\\b/g,MARCA);
    }
  }
  function limpar(){
    if(redirecionar())return;
    document.querySelectorAll('button[aria-label^="Assistir"],img[src*="/assets/cover-"],img[src*="ai-tools-cover"]').forEach(function(el){
      var card=el.closest('[class*="_card_"]');
      if(card&&!card.dataset.marcaRemovido){card.dataset.marcaRemovido='1';card.remove();}
    });
    Object.keys(ESCONDER).forEach(function(rota){
      document.querySelectorAll('a[href^="'+rota+'"]').forEach(function(a){
        var item=a.closest('li')||a.parentElement;
        if(item&&!item.dataset.marcaRemovido){
          item.dataset.marcaRemovido='1';item.style.display='none';
          var bloco=item.parentElement;
          while(bloco&&!bloco.querySelector('.section-title-container'))bloco=bloco.parentElement;
          if(bloco&&![].some.call(bloco.querySelectorAll('a'),function(x){return x.getClientRects().length;}))bloco.style.display='none';
        }
      });
    });
    // Aba "Aplicativos" do painel de administração.
    document.querySelectorAll('a[href="/settings/admin-panel#apps"]').forEach(function(a){
      a.style.display='none';
    });
    // Aparência "Somente Enterprise" (tema de venda, sem efeito prático aqui).
    document.querySelectorAll('label').forEach(function(l){
      var campo=l.querySelector('input[value="Salesfarce"]');
      if(campo)l.style.display='none';
    });
    textos(document.body);
  }
  var agendado=false;
  function agenda(){
    if(!agendado){agendado=true;setTimeout(function(){agendado=false;limpar();},80);}
  }
  new MutationObserver(agenda).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  document.addEventListener('DOMContentLoaded',limpar);
})();
</script></head>`;

// Página base: título da aba e prévias de link.
trocar(path.join(front, 'index.html'), (s) =>
  s
    .replace(/<title>Twenty<\/title>/, `<title>${MARCA}</title>`)
    .replace(/(property="og:title" content=")Twenty"/, `$1${MARCA}"`)
    .replace(/(name="twitter:title" content=")Twenty"/, `$1${MARCA}"`),
);

trocar(path.join(front, 'index.html'), (s) => s.replace('</head>', scriptUi));

// Quadro (módulo quadros): o front component roda num worker e não consegue cancelar a tempo o menu do
// navegador no botão direito; este ouvinte cancela só dentro da área marcada, onde o quadro abre o próprio menu.
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    `<script>document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&t.closest&&t.closest('[data-testid="quadro-area-desenho"]'))e.preventDefault();},true);</script></head>`,
  ),
);

// Menus de front component com o zoom do tema (--t-zoom 1.2): o motor mede o botão em pixels de tela, mas
// posiciona o menu numa camada (z-index 38, contain: layout) que o zoom da página amplia de novo, e o menu
// abria 20% mais longe (fora da tela no canto direito). A camada passa a usar zoom 1 (coordenadas em pixels
// de tela) e só o conteúdo do menu volta a ser ampliado. A build para se o motor mudar a camada.
const camadaPortal = fs
  .readdirSync(assets)
  .filter((f) => f.endsWith('.js'))
  .some((f) => {
    const js = fs.readFileSync(path.join(assets, f), 'utf8');

    return /zIndex:38,pointerEvents:"none",overflow:"clip"/.test(js) && js.includes('/ var(--t-zoom, 1))');
  });
if (!camadaPortal) {
  throw new Error('Camada de menus dos front components mudou no motor: revise o CSS "menus-front-component".');
}
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    `<style id="menus-front-component">:root{--ic-zoom-raiz:var(--t-zoom);}` +
      `body>div[style*="z-index: 38"][style*="contain: layout"]{--t-zoom:1;zoom:calc(1 / var(--ic-zoom-raiz));}` +
      `body>div[style*="z-index: 38"][style*="contain: layout"] [style*="--transform-origin"]>*{zoom:var(--ic-zoom-raiz);}</style></head>`,
  ),
);

// Quadro, modo foco: o worker não tem a Fullscreen API. O botão do quadro fica num elemento marcado
// "quadro-entrar-foco"/"quadro-sair-foco"; este ouvinte (no clique real, que vale como gesto do usuário)
// põe ou tira o navegador da tela cheia. Se o usuário sair da tela cheia pelo Esc do navegador, clica no
// botão "sair" para o quadro deixar o modo foco também.
// O CSS solta a camada fixa do quadro: ancestrais com will-change/transform/contain/container-type
// (o slot do widget e a rolagem da aba) prendem position:fixed dentro da aba. Só vale com o foco ligado.
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    `<style id="quadro-modo-foco">:has([data-testid="quadro-sair-foco"]){will-change:auto!important;transform:none!important;filter:none!important;contain:none!important;container-type:normal!important;}</style>` +
    `<script>(function(){var saindo=false;function alvo(e,id){var t=e.target;return t&&t.closest&&t.closest('[data-testid="'+id+'"]');}document.addEventListener('click',function(e){if(alvo(e,'quadro-entrar-foco')){var r=document.documentElement;if(!document.fullscreenElement&&r.requestFullscreen)r.requestFullscreen().catch(function(){});}else if(alvo(e,'quadro-sair-foco')&&document.fullscreenElement){saindo=true;document.exitFullscreen().catch(function(){});}},true);document.addEventListener('fullscreenchange',function(){if(document.fullscreenElement)return;if(saindo){saindo=false;return;}var b=document.querySelector('[data-testid="quadro-sair-foco"] button');if(b)b.click();});})();</script></head>`,
  ),
);

// Tema IntegraCore (cores e neutros). Antes de injetar, confere se cada variável que o tema
// sobrescreve ainda existe no CSS compilado: se uma versão nova renomear alguma, a build para aqui.
const tema = fs.readFileSync(path.join(__dirname, 'tema-integracore.css'), 'utf8');
const cssCompilado = fs
  .readdirSync(assets)
  .filter((f) => f.endsWith('.css') || f.endsWith('.js'))
  .map((f) => fs.readFileSync(path.join(assets, f), 'utf8'))
  .join('\n');
const variaveisDoTema = [...new Set(tema.match(/--t-[a-z0-9-]+(?=\s*:)/g))];
const sumiram = variaveisDoTema.filter((v) => !cssCompilado.includes(`${v}:`));
if (sumiram.length > 0) {
  throw new Error(`Variáveis do tema que não existem mais no CSS compilado: ${sumiram.join(', ')}`);
}
trocar(path.join(front, 'index.html'), (s) =>
  s.replace('</head>', `<style id="tema-integracore">${tema}</style></head>`),
);

// Fontes do visual IntegraCore: serifa dos títulos e a de números dos painéis
// (usadas em apps/integracore/src/modules/shared/constants/estilo-pagina.ts).
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap"></head>',
  ),
);

// App instalado (PWA), com a cor de destaque da marca.
trocar(path.join(front, 'manifest.json'), (s) =>
  s
    .replace(/"(short_name|name)": "Twenty"/g, `"$1": "${MARCA}"`)
    .replace(/"theme_color": "#000000"/, '"theme_color": "#B05438"'),
);

// Traduções exibidas: só textos, as chaves são códigos. Todas as línguas, para quem trocar de idioma
// não ver o nome antigo.
const traducoes = fs.readdirSync(assets).filter((f) => /^[a-z]{2}(-[A-Za-z]{2,4})?-[\w-]+\.js$/.test(f));
const comMarcaAntiga = traducoes.filter((f) => /\bTwenty\b/.test(fs.readFileSync(path.join(assets, f), 'utf8')));
if (!comMarcaAntiga.some((f) => f.startsWith('pt-BR-'))) {
  throw new Error(`Tradução pt-BR com "Twenty" não encontrada em ${assets}`);
}
for (const f of comMarcaAntiga) trocarTudo(path.join(assets, f));

// Resto do front: textos escritos direto nos componentes (menus, configurações, avisos).
for (const f of fs.readdirSync(assets).filter((f) => f.endsWith('.js'))) {
  const arquivo = path.join(assets, f);
  if (/\bTwenty\b|twenty\.com|twentyhq/.test(fs.readFileSync(arquivo, 'utf8'))) trocarTudo(arquivo);
}

// Servidor: assuntos e corpos dos e-mails, prompt da IA e mensagens de erro.
const dist = path.join(server, 'dist');
const empilhar = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) empilhar(p);
    else if (e.name.endsWith('.js') && p !== __filename) {
      if (/\bTwenty\b|twenty\.com|twentyhq/.test(fs.readFileSync(p, 'utf8'))) trocarTudo(p);
    }
  }
};
empilhar(dist);
