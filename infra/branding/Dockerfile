# Imagem do motor com a marca IntegraCore (título, ícones, textos e caminhos internos).
# Não altera o código do motor: só renomeia os pacotes internos, troca arquivos estáticos já
# compilados e reaplica a marca na interface e nos e-mails.
ARG TAG=v2.58.2

# Editor do Quadro (Excalidraw), servido em /quadro-excalidraw/ e aberto em iframe pelo front component.
FROM node:24-slim AS quadro
WORKDIR /quadro
COPY quadro-excalidraw/package.json quadro-excalidraw/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY quadro-excalidraw/ ./
RUN npm run build

FROM twentycrm/twenty:${TAG}

ARG FRONT=/app/packages/twenty-server/dist/front

# Os pacotes do monorepo ganham o nome da marca; o caminho antigo continua existindo por link,
# então nada que dependa dele (node_modules, comandos, volumes) quebra.
USER root
RUN cd /app/packages \
 && for p in client-sdk emails server shared; do mv "twenty-$p" "integracore-$p" && ln -s "integracore-$p" "twenty-$p"; done

# A lista de workspaces do monorepo acompanha os caminhos novos (os nomes dos pacotes seguem como estão,
# é por eles que as dependências internas se resolvem). O pacote de regras de lint não vem na imagem
# de produção; entra um vazio só para a resolução do yarn fechar.
COPY oxlint-rules /app/packages/integracore-oxlint-rules
RUN sed -i 's#packages/twenty-#packages/integracore-#g' /app/package.json \
 && cd /app && yarn install --mode=skip-build \
 && rm -rf /app/.yarn/cache
USER 1000

COPY icons/ ${FRONT}/images/icons/
COPY --from=quadro /quadro/dist/ ${FRONT}/quadro-excalidraw/
COPY logo-integracore.svg ${FRONT}/images/integrations/twenty-logo.svg
COPY aplicar-marca.js tema-integracore.css /tmp/
RUN node /tmp/aplicar-marca.js ${FRONT}
