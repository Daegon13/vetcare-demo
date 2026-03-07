#!/usr/bin/env bash
set -euo pipefail

# Detect common unresolved merge conflict markers.
# Use git grep so CI does not depend on external tools like ripgrep.
if git grep -n -I -E '^(<<<<<<<|=======|>>>>>>>)' -- .; then
  echo "❌ Conflict markers detected. Resolve merge conflicts before committing."
  exit 1
fi

echo "✅ No conflict markers found."
