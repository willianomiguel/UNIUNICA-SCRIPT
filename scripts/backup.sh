#!/usr/bin/env bash
# Backup do banco (Postgres) e dos arquivos enviados ao Twenty.
# Uso: scripts/backup.sh [pasta-destino]   (padrão: ./backups)
# Sugestão: agendar no cron do servidor, ex.: 0 3 * * * /caminho/scripts/backup.sh /srv/backups
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-$ROOT/backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEST"
cd "$ROOT/infra"
set -a; source .env; set +a

echo "→ Banco de dados…"
docker compose exec -T db pg_dump -U "${PG_DATABASE_USER:-postgres}" -d "${PG_DATABASE_NAME:-default}" -Fc \
  > "$DEST/db-$STAMP.dump"

echo "→ Arquivos enviados (anexos, imagens)…"
docker compose exec -T server tar -czf - -C /app/packages/twenty-server/.local-storage . \
  > "$DEST/arquivos-$STAMP.tar.gz"

echo "→ Removendo backups com mais de $KEEP_DAYS dias…"
find "$DEST" -name 'db-*.dump' -mtime +"$KEEP_DAYS" -delete
find "$DEST" -name 'arquivos-*.tar.gz' -mtime +"$KEEP_DAYS" -delete

echo "✓ Backup salvo em $DEST ($STAMP)"
