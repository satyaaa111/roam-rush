# --- STAGE 1: The "Builder" ---
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- STAGE 2: The "Runner" ---
FROM node:20-alpine
WORKDIR /app

# Create user/group
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package.json (still root)
COPY package*.json ./

# Install runtime deps (still root)
RUN npm install --omit=dev

# Copy build files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY runtime-env.sh ./runtime-env.sh

RUN chmod +x ./runtime-env.sh

USER nextjs

EXPOSE 3000

# Ensure script is invoked before Next.js app starts
CMD ["sh", "-c", "./runtime-env.sh && npm start"]
