#!/usr/bin/env bash
# scripts/git/prune-merged-branches.sh
# Deletes remote branches that are fully merged into main.
set -euo pipefail

REMOTE=${1:-origin}

# Fetch latest refs
git fetch --prune "$REMOTE"

# Get list of merged remote branches excluding main/master/HEAD
git branch -r --merged "$REMOTE/main" | \
  grep -vE "main$|HEAD$|master$" | while read -r ref; do
  branch=${ref#"$REMOTE/"}
  echo "Deleting remote branch $branch"
  git push "$REMOTE" --delete "$branch"
done

echo "Pruning complete."
