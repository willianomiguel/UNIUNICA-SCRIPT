// Troca o nome "Twenty" por "IntegraCore" nos textos que o usuário vê.
// Roda no build da imagem (ver Dockerfile). Falha o build se não achar o que trocar,
// para uma versão nova do Twenty não passar despercebida.
const fs = require('fs');
const path = require('path');

const MARCA = 'IntegraCore';
const front = process.argv[2];
const assets = path.join(front, 'assets');

const trocar = (arquivo, transformar) => {
  const antes = fs.readFileSync(arquivo, 'utf8');
  const depois = transformar(antes);
  if (antes === depois) throw new Error(`Nada trocado em ${arquivo}`);
  fs.writeFileSync(arquivo, depois);
  console.log(`marca aplicada: ${path.relative(front, arquivo)}`);
};

// Página base: título da aba e prévias de link.
trocar(path.join(front, 'index.html'), (s) =>
  s
    .replace(/<title>Twenty<\/title>/, `<title>${MARCA}</title>`)
    .replace(/(property="og:title" content=")Twenty"/, `$1${MARCA}"`)
    .replace(/(name="twitter:title" content=")Twenty"/, `$1${MARCA}"`),
);

// Quadro (módulo quadros): o front component roda num worker e não consegue cancelar a tempo o menu do
// navegador no botão direito; este ouvinte cancela só dentro da área marcada, onde o quadro abre o próprio menu.
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    `<script>document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&t.closest&&t.closest('[data-testid="quadro-area-desenho"]'))e.preventDefault();},true);</script></head>`,
  ),
);

// Tema IntegraCore (cores e neutros). Antes de injetar, confere se cada variável do Twenty que o tema
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
  throw new Error(`Variáveis do tema que não existem mais no Twenty: ${sumiram.join(', ')}`);
}
trocar(path.join(front, 'index.html'), (s) =>
  s.replace('</head>', `<style id="tema-integracore">${tema}</style></head>`),
);

// Fontes do visual IntegraCore: serifa dos títulos e a de números dos painéis
// (usadas em apps/uniunica/src/modules/shared/constants/estilo-pagina.ts).
trocar(path.join(front, 'index.html'), (s) =>
  s.replace(
    '</head>',
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap"></head>',
  ),
);

// App instalado (PWA).
trocar(path.join(front, 'manifest.json'), (s) =>
  s.replace(/"(short_name|name)": "Twenty"/g, `"$1": "${MARCA}"`),
);

// Traduções exibidas (pt-BR e inglês): só textos, as chaves são códigos.
const traducoes = fs
  .readdirSync(assets)
  .filter((f) => /^(pt-BR|en)-[\w-]+\.js$/.test(f))
  .filter((f) => /\bTwenty\b/.test(fs.readFileSync(path.join(assets, f), 'utf8')));
if (!traducoes.some((f) => f.startsWith('pt-BR-'))) {
  throw new Error(`Tradução pt-BR com "Twenty" não encontrada em ${assets}`);
}
for (const f of traducoes) {
  trocar(path.join(assets, f), (s) => s.replace(/\bTwenty\b/g, MARCA));
}
