#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

if [ -n "${ENV_CONTENT:-}" ]; then
    printf '%s\n' "$ENV_CONTENT" > .env
fi

if [ -f .env ]; then
    set -o allexport
    source .env
    set +o allexport
fi

export PORT="${NUXT_PORT:-10060}"
export NODE_ENV=production
APP_NAME="rolla"

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh" > /dev/null 2>&1
fi

if [ -d "$NVM_DIR/versions/node" ]; then
    LATEST_NODE=$(ls "$NVM_DIR/versions/node" 2>/dev/null | tail -n 1)
    if [ -n "$LATEST_NODE" ]; then
        export PATH="$NVM_DIR/versions/node/$LATEST_NODE/bin:$PATH"
    fi
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Installing dependencies..."
npm install

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Building Nuxt app..."
npm run build

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restarting app in PM2..."
pm2 restart "$APP_NAME" --update-env > /dev/null 2>&1 || pm2 start ecosystem.config.cjs > /dev/null 2>&1
pm2 save > /dev/null 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deployment completed successfully!"
