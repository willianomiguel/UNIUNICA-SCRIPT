#!/usr/bin/env bash
# Sincroniza o app apps/integracore com o servidor ativo (remote padrão do CLI).
# Usa uma trava para que só um `yarn integra app apply` rode por vez.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/dev-env.sh"
cd "$ROOT/apps/integracore"
exec flock "${TMPDIR:-/tmp}/integracore-apply.lock" yarn integra app apply --no-input "$@"
