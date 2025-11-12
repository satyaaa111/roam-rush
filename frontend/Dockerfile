# --- STAGE 1: Builder ---
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ✅ Inject a harmless dummy variable at build time to avoid resolution errors
ARG DUMMY_API_URL="http://localhost:8080"
ENV NEXT_PUBLIC_API_BASE_URL=$DUMMY_API_URL

RUN npm run build

# --- STAGE 2: Runner ---
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --chown=nextjs:nodejs package*.json ./
RUN chown -R nextjs:nodejs /app
USER nextjs
RUN npm install --omit=dev

# Copy the built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# ✅ Copy runtime environment variable injection script
COPY runtime-env.sh ./runtime-env.sh
RUN chmod +x ./runtime-env.sh

EXPOSE 3000

# ✅ Inject runtime env var before starting
ENTRYPOINT ["sh", "-c", "./runtime-env.sh && npm start"]
