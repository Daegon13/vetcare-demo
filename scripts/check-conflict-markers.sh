#!/usr/bin/env bash
set -euo pipefail

PATTERN='^<<<<<<< .*$|^=======$|^>>>>>>> .*$'

if rg --line-number --hidden --glob '!.git' --glob '!node_modules' --pcre2 "$PATTERN" .; then
  echo "❌ Conflict markers detected. Resolve merge conflicts before committing."
  exit 1
fi

echo "✅ No conflict markers found."
