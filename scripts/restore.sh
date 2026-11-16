#!/usr/bin/env bash
# Restaura um backup feito com scripts/backup.sh.
# Uso: scripts/restore.sh backups/db-AAAAMMDD-HHMMSS.dump [backups/arquivos-AAAAMMDD-HHMMSS.tar.gz]
# ATENÇÃO: substitui TODOS os dados atuais.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_DUMP="$(realpath "$1")"; FILES="${2:+$(realpath "$2")}"
cd "$ROOT/infra"
set -a; source .env; set +a
read -r -p "Isso apaga os dados atuais e restaura o backup. Digite RESTAURAR para continuar: " ok
[ "$ok" = "RESTAURAR" ] || { echo "Cancelado."; exit 1; }

docker compose stop server worker
docker compose exec -T db pg_restore -U "${PG_DATABASE_USER:-postgres}" -d "${PG_DATABASE_NAME:-default}" \
  --clean --if-exists --no-owner < "$DB_DUMP"
if [ -n "$FILES" ]; then
  docker compose run --rm -T --entrypoint sh server -c \
    'rm -rf /app/packages/integracore-server/.local-storage/* && tar -xzf - -C /app/packages/integracore-server/.local-storage' < "$FILES"
fi
docker compose start server worker
echo "✓ Restaurado."
