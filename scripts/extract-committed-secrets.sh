#!/bin/bash

set -euo pipefail

DEBUG=${DEBUG:-0}

LOG_DIR="logs"
LOG_FILE="$LOG_DIR/scan-logs.txt"
mkdir -p "$LOG_DIR"
echo "Starting commit diff scan..." > "$LOG_FILE"

PATTERN_REGEX='(_EMAIL_|API[_-]?KEY|API_SECRET|SECRET_KEY|AWS_SECRET|AWS_ACCESS_KEY|ACCESS_KEY_ID|SECRET_ACCESS_KEY|PASSWORD=|PASSWORD|PASS|TOKEN|AUTH_TOKEN|PRIVATE[_-]?KEY|SECRET|DATABASE_URL)'
ENV_VAR_REGEX='^[A-Za-z_][A-Za-z0-9_]*=.*'

EXCLUDED_DIRS='^(\.yarn|node_modules|build|\.next)/'
EXCLUDED_EXTS='\.(png|jpe?g|gif|webp|ico|bmp|svg|tiff|ttf|woff2?|eot|pdf|zip|gz|tar|mp4|mp3|ogg|mov|exe|dll|so|bin|obj|pyc|pyo|tsbuildinfo|map)$'

# Count total commits first
all_commits=($(git rev-list --all))
total_commits=${#all_commits[@]}
current=0

echo "Total commits: $total_commits" | tee -a "$LOG_FILE"

for commit in "${all_commits[@]}"; do
  current=$((current + 1))
  echo "🔄 [$current/$total_commits] Checking commit $commit..."

  files=$(git diff-tree --no-commit-id --name-only -r "$commit" | grep -Ev "$EXCLUDED_DIRS" || true)
  for file in $files; do
    [[ "$file" =~ $EXCLUDED_EXTS ]] && continue

    if ! git cat-file -e "$commit:$file" 2>/dev/null; then continue; fi

    diff_lines=$(git diff "$commit^" "$commit" -- "$file" | grep '^+' | grep -v '^+++' || true)
    echo "$diff_lines" | grep -aIq . || continue

    matches=$(echo "$diff_lines" | grep -Ein "$PATTERN_REGEX" || true)
    envs=$(echo "$diff_lines" | grep -En "$ENV_VAR_REGEX" || true)

    if [[ -n "$matches" || -n "$envs" ]]; then
      echo "🔐 Commit: $commit ($current/$total_commits)" | tee -a "$LOG_FILE"
      echo "📄 File: $file" | tee -a "$LOG_FILE"
      [[ -n "$matches" ]] && echo "$matches" | tee -a "$LOG_FILE"
      [[ -n "$envs" ]] && echo "$envs" | tee -a "$LOG_FILE"
      echo "-----------------------------" | tee -a "$LOG_FILE"
    fi
  done
done

echo "✅ Done. Results saved to $LOG_FILE"
