#!/usr/bin/env bash
# Sincroniza o app apps/uniunica com o Twenty ativo (remote padrão do CLI).
# Usa uma trava para que só um `twenty app apply` rode por vez.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/dev-env.sh"
cd "$ROOT/apps/uniunica"
exec flock "${TMPDIR:-/tmp}/uniunica-apply.lock" twenty app apply --no-input "$@"
