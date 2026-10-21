#!/usr/bin/env bash
set -euo pipefail

SOURCE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/nginx-date-planner.conf"
SITES_AVAILABLE=/etc/nginx/sites-available
SITES_ENABLED=/etc/nginx/sites-enabled
DEFAULT_LINK="$SITES_ENABLED/default"
DEFAULT_BACKUP="$SITES_AVAILABLE/default.pre-date-planner"
SITE="$SITES_AVAILABLE/date-planner"
ENABLED="$SITES_ENABLED/date-planner"

test -f "$SOURCE" || { echo "Missing $SOURCE" >&2; exit 1; }
if [[ -e "$DEFAULT_LINK" && ! -L "$DEFAULT_LINK" ]]; then
  echo "Refusing to replace non-symlink Nginx default site" >&2; exit 1
fi
if [[ -L "$DEFAULT_LINK" ]]; then
  TARGET="$(readlink -f "$DEFAULT_LINK")"
  if [[ "$TARGET" != "$SITES_AVAILABLE/default" ]]; then
    echo "Refusing to disable custom Nginx site: $TARGET" >&2; exit 1
  fi
  if [[ ! -e "$DEFAULT_BACKUP" ]]; then cp -a "$TARGET" "$DEFAULT_BACKUP"; fi
  rm "$DEFAULT_LINK"
fi
install -m 0644 "$SOURCE" "$SITE"
ln -sfn "$SITE" "$ENABLED"
if ! nginx -t; then
  rm -f "$ENABLED"
  if [[ -e "$DEFAULT_BACKUP" ]]; then ln -sfn "$SITES_AVAILABLE/default" "$DEFAULT_LINK"; fi
  exit 1
fi
systemctl reload nginx
