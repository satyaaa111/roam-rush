# --- STAGE 1: Builder ---
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- STAGE 2: Runner ---
FROM node:20-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# Copy only package files first
COPY package*.json ./

# IMPORTANT: Install runtime deps WHILE STILL ROOT!
RUN npm install --omit=dev

# Copy build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy runtime script
COPY runtime-env.sh ./runtime-env.sh
RUN chmod +x ./runtime-env.sh

# Give public folder write permission to nextjs user
RUN chown -R nextjs:nodejs /app/public

# Switch to non-root user
USER nextjs

EXPOSE 3000

# At container start: create runtime-config.json then start Next.js
CMD ["sh", "-c", "./runtime-env.sh && npm start"]
