# IntegraCore — app

App da plataforma IntegraCore: os módulos de gestão (roadmap, projetos, ideias, sprints, vendas,
financeiro, metas, tráfego, wiki, quadros, cofre e alertas) rodam aqui, sobre o motor em `integra-core/`.

## Módulos

Cada módulo vive em `src/modules/<modulo>/` com objetos, campos, telas, funções, testes e README próprios.
A lista completa e o que cada um faz estão no [README da raiz](../../README.md).

## Começando

Instruções de instalação e de ambiente estão em [SETUP.md](SETUP.md). Regras de código e de
desenvolvimento estão em [AGENTS.md](AGENTS.md).

## Publicação

O workflow `Publish` (`.github/workflows/publish.yml`) publica o app em um registro npm com proveniência
via trusted publishing. Para publicar:

1. Registre este repositório como trusted publisher do pacote no registro.
2. Suba a versão em `package.json` e empurre uma tag de versão (ex.: `git tag v1.0.0 && git push --tags`)
   ou rode o workflow manualmente na aba Actions.

## Mudanças

Mudanças relevantes ficam em [CHANGELOG.md](CHANGELOG.md).
