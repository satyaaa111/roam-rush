#!/bin/sh
# runtime-env.sh — runs inside ECS container before Next.js starts

echo "✅ Injecting runtime API_BASE_URL into Next.js runtime"

# Replace the dummy value with actual ECS-provided API_BASE_URL
cat > .env.production <<EOF
NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
EOF

echo "✅ NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}"
