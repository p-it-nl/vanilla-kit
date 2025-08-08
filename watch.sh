#!/bin/sh
set -e

echo "Watching for changes..."

LAST_CHECK=0
while true; do
  CURRENT=$(find src -type f -newermt "@$LAST_CHECK" | head -n 1 || true)
  if [ -n "$CURRENT" ]; then
    echo "Change detected: $CURRENT"
    ./build.sh debug
    LAST_CHECK=$(date +%s)
  fi
  sleep 2
done