#!/bin/sh
# runtime-env.sh — runs inside ECS container before Next.js starts

echo "Writing runtime-config.json from API_BASE_URL=${API_BASE_URL:-''}"
cat > /app/public/runtime-config.json <<EOF
{ "API_BASE_URL": "${API_BASE_URL:-''}" }
EOF
