# Imagem do Twenty com a marca IntegraCore (título, ícones e textos da interface).
# Não altera o código do Twenty: só troca arquivos estáticos já compilados do front.
ARG TAG=v2.58.2
FROM twentycrm/twenty:${TAG}

ARG FRONT=/app/packages/twenty-server/dist/front
COPY icons/ ${FRONT}/images/icons/
COPY aplicar-marca.js tema-integracore.css /tmp/
RUN node /tmp/aplicar-marca.js ${FRONT}
