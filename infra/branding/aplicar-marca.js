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
// esconde a Comunidade e corrige textos que vêm de dados ou de exemplos (ex.: "por Twenty",
// "npx twenty@latest"). Roda como observador para pegar telas montadas depois.
const scriptUi = `
<script id="marca-ui">
(function(){
  var MARCA='${MARCA}';
  function textos(raiz){
    var w=document.createTreeWalker(raiz,4,null),n;
    while((n=w.nextNode())){
      var v=n.nodeValue;
      if(!v||(v.indexOf('Twenty')<0&&v.indexOf('twenty')<0))continue;
      n.nodeValue=v.replace(/npx twenty@latest/g,'yarn integra').replace(/\\bTwenty\\b/g,MARCA);
    }
  }
  function limpar(){
    if(location.pathname.replace(/\\/$/,'')==='/settings/community'){location.replace('/settings/profile');return;}
    document.querySelectorAll('button[aria-label^="Assistir"],img[src*="/assets/cover-"],img[src*="ai-tools-cover"]').forEach(function(el){
      var card=el.closest('[class*="_card_"]');
      if(card&&!card.dataset.marcaRemovido){card.dataset.marcaRemovido='1';card.remove();}
    });
    document.querySelectorAll('a[href$="/settings/community"]').forEach(function(a){
      var item=a.closest('li')||a.parentElement;
      if(item&&!item.dataset.marcaRemovido){
        item.dataset.marcaRemovido='1';item.style.display='none';
        var bloco=item.parentElement;
        while(bloco&&!bloco.querySelector('.section-title-container'))bloco=bloco.parentElement;
        if(bloco&&![].some.call(bloco.querySelectorAll('a'),function(x){return x.getClientRects().length;}))bloco.style.display='none';
      }
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
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap"></head>',
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
